var _ = require('lodash')

var courses = {
  'Web Operations': {
    summary: 'Operations',
    url: 'https://wiki.mediacube.at/wiki/index.php/Web_Operations_-_SS_2015'
  },
  'Concurrent & Distributed Systems': {
    summary: 'Concurrent & Distributed',
    url: 'https://wiki.mediacube.at/wiki/index.php/Concurrent_und_Distributed_Systems_-_SS_2015'
  },
  'Semantic Web Technologies': {
    summary: 'Semantic Web',
    url: 'https://wiki.mediacube.at/wiki/index.php/Semantic_Web_Technologies_-_SS_2015'
  },
  'Backend Development': {
    summary: 'Backend',
    url: 'https://wiki.mediacube.at/wiki/index.php/Backend_Development_2_-_SS_2015'
  },
  'Bachelorarbeit': {
    summary: 'Bakk',
    url: 'https://wiki.mediacube.at/wiki/index.php/Bachelorarbeit_1_und_Begleitlehrveranstaltung_-_SS_2015'
  },
  'HCI-Studio': {
    summary: 'HCI',
    url: 'https://wiki.mediacube.at/wiki/index.php/HCI-Studio_-_SS_2015'
  },
  'Multimediaprojekt 2': {
    summary: 'MMP 2',
    url: 'https://wiki.mediacube.at/wiki/index.php/Multimediaprojekt_2_Web_-_SS_2015'
  },
  'Multimediaprojekt 3': {
    summary: 'MMP 3',
    url: 'https://wiki.mediacube.at/wiki/index.php/Multimediaprojekt_3_Kickoff_-_Web_-_SS_2015'
  },
  'Mobile Applications': {
    summary: 'Mobile',
    url: 'https://wiki.mediacube.at/wiki/index.php/Mobile_Applications_2_-_SS_2015'
  },
  'Teamorientierter Reflexionsprozess': {
    summary: 'Reflexion',
    url: 'https://wiki.mediacube.at/wiki/index.php/Teamorientierter_Reflexionsprozess_2_-_SS_2015'
  },
  'Kryptographie und Mediensicherheit': {
    summary: 'Crypto',
    url: 'https://wiki.mediacube.at/wiki/index.php/Kryptographie_und_Mediensicherheit_-_SS_2015'
  },
  'Digital Media Systems': {
    summary: 'Digital Media',
    url: 'https://wiki.mediacube.at/wiki/index.php/Digital_Media_Systems_-_SS_2015'
  }
}

var blacklist = [
  'MMA GASTVORTRAG',
  'Frontend Development'
]

module.exports = function (event) {
  if (event.type !== 'VEVENT') return

  event.description = description(event)

  var info = normalize(event)
  if (!info) return

  return _(event)
    .assign(info)
    .pick(['uid', 'summary', 'description', 'location', 'start', 'end', 'url'])
    .value()
}

function description (event) {
  return event.description + '\n\n' + event.summary
}

function normalize (event) {
  var summary = event.summary

  for (var block in blacklist) {
    if ((new RegExp(blacklist[block], 'i')).test(summary)) return
  }

  for (var course in courses) {
    if ((new RegExp(course, 'i')).test(summary)) return {
      summary: extras(summary, courses[course].summary),
      url: courses[course].url
    }
  }

  return {
    summary: summary
  }
}

function extras (raw, name) {
  if (/klausur/i.test(raw)) name += ' Klausur'
  if (/UB\//i.test(raw)) name += ' Übung'
  return name
}
