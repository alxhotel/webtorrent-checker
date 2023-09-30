const path = require('path')
const webtorrentHealth = require('webtorrent-health')
const pug = require('pug')
const express = require('express')
const app = express()

const config = require('../config')

// Use pug for templates
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')
app.engine('pug', pug.renderFile)

// Serve static resources
app.use(express.static(path.join(__dirname, '../static')))

// Serve all the pug pages
app.get('/', function (req, res) {
  res.render('index', { rawTitle: 'WebTorrent Checker - Check any magnet link or torrent file' })
})

// GET /check
app.get('/check', function (req, res) {
  console.log(req.query)

  if (!req.query.magnet) return res.send({ error: { code: 404, message: 'Missing magnet link' } })

  webtorrentHealth(req.query.magnet, {
    timeout: 2000
  }, function (err, data) {
    if (err) return res.send({ error: { code: 500, message: err.message } })

    // Send results
    res.send(data)
  })
})

app.listen(config.port, function () {
  console.log('Webtorrent-Checker app is listening on port ' + config.port + '!')
})
