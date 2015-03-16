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
  ical.fromURL(process.env.FEED_URL, {}, function (err, result) {
    if (err) console.log(err)

    cal.events(
      _(result)
        .map(normalize)
        .compact()
        .value()
    )

    cal.serve(res)
  })
}).listen(process.env.PORT || 3000, function () {
  console.log('listening on ' + (process.env.PORT || 3000))
})
