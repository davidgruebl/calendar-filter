var http = require('http')

var _ = require('lodash')
var ical = require('ical')

var normalize = require('./normalize')

var cal = require('ical-generator')({
  domain: 'boennemann.me',
  name: 'Uni Calendar',
  timezone: 'Europe/Berlin',
  prodId: {
    company: 'boennemann',
    product: 'calendar'
  }
})

http.createServer(function (req, res) {
  console.log('ics requested')

  ical.fromURL(process.env.FEED_URL, {}, function (err, result) {
    console.log('raw ics loaded')

    if (err) console.log(err)

    cal.events(
      _(result)
        .map(normalize)
        .compact()
        .value()
    )

    console.log('filtered ics served')
    res.setHeader('Content-Type', 'text/calendar; charset=utf-8')
    cal.serve(res)
  })
}).listen(process.env.PORT || 3000, function () {
  console.log('listening on ' + (process.env.PORT || 3000))
})
