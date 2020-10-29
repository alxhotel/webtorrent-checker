/* global XMLHttpRequest */
const parseTorrent = require('parse-torrent')

module.exports = function () {
  // Initialize page
  init()

  function init () {
    // Initialize listeners
    const form = document.querySelector('#search form')
    if (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault()
        const magnetInput = document.querySelector('form #magnet-input')
        const magnetLink = magnetInput.value.trim()

        let parsedTorrent
        try {
          // Parse magnet link
          parsedTorrent = parseTorrent(magnetLink)
        } catch (err) {
          return showError('Invalid magnet link')
        }

        // Get health
        magnetInput.value = ''
        hideResponse()
        showLoading(parsedTorrent.infoHash)
        getHealth(magnetLink, function (response) {
          if (response.error) return showError(response.error.message)

          // Show response
          showResponse(response)
        })
      })
    }

    const fileInput = document.querySelector('#file-input')
    if (fileInput) {
      fileInput.addEventListener('change', function (e) {
        e.preventDefault()

        // Check amount
        if (fileInput.files.length === 0) return showError('No file selected')

        // Parse torrent
        parseTorrent.remote(fileInput.files[0], function (err, parsedTorrent) {
          if (err) return showError('Invalid torrent file')

          // Torrent to magnet link
          const magnetLink = parseTorrent.toMagnetURI(parsedTorrent)

          // Get health
          fileInput.value = fileInput.defaultValue
          hideResponse()
          showLoading(parsedTorrent.infoHash)
          getHealth(magnetLink, function (response) {
            if (response.error) return showError(response.error.message)

            // Show response
            showResponse(response)
          })
        })
      })
    }
  }

  function getHealth (magnetLink, callback) {
    console.log('Getting health of: ' + magnetLink)

    const xmlhttp = new XMLHttpRequest()
    xmlhttp.open('GET', '/check?magnet=' + encodeURIComponent(magnetLink))
    xmlhttp.send(null)
    xmlhttp.onreadystatechange = function () {
      if (this.readyState === 4 && this.status === 200) {
        const response = JSON.parse(this.responseText)
        if (callback) callback(response)
      }
    }
  }

  function showResponse (response) {
    hideLoading()

    // Log response
    console.log(response)

    const results = {
      webtorrent: {
        num_trackers: 0,
        seeders: 0,
        peers: 0
      },
      bittorrent: {
        num_trackers: 0,
        seeders: 0,
        peers: 0
      }
    }

    for (let i = 0; i < response.extra.length; i++) {
      const info = response.extra[i]
      if (info.error) continue

      let torrent
      if (info.tracker.indexOf('wss') >= 0) {
        torrent = results.webtorrent
      } else {
        torrent = results.bittorrent
      }

      torrent.num_trackers++
      torrent.seeders += info.seeds
      torrent.peers += info.peers
    }

    // Calculate average
    if (results.webtorrent.num_trackers === 0) results.webtorrent.num_trackers = 1
    if (results.bittorrent.num_trackers === 0) results.bittorrent.num_trackers = 1
    results.webtorrent.seeders = Math.round(results.webtorrent.seeders / results.webtorrent.num_trackers)
    results.webtorrent.peers = Math.round(results.webtorrent.peers / results.webtorrent.num_trackers)
    results.bittorrent.seeders = Math.round(results.bittorrent.seeders / results.bittorrent.num_trackers)
    results.bittorrent.peers = Math.round(results.bittorrent.peers / results.bittorrent.num_trackers)

    // Show numbers
    const webtorrentPeers = document.querySelector('#webtorrent-peers')
    const webtorrentSeeders = document.querySelector('#webtorrent-seeders')
    const bittorrentPeers = document.querySelector('#bittorrent-peers')
    const bittorrentSeeders = document.querySelector('#bittorrent-seeders')

    webtorrentPeers.textContent = results.webtorrent.peers
    webtorrentSeeders.textContent = results.webtorrent.seeders
    bittorrentPeers.textContent = results.bittorrent.peers
    bittorrentSeeders.textContent = results.bittorrent.seeders

    // Show results
    const resultsBox = document.querySelector('#results')
    resultsBox.style.display = 'block'
  }

  function showError (message) {
    hideLoading()
    const errorBox = document.querySelector('#error')
    errorBox.textContent = message
    errorBox.style.display = 'block'
  }

  function showLoading (infoHash) {
    const loadingBox = document.querySelector('#loading')
    loadingBox.style.display = 'block'
    document.querySelector('#loading .info-hash').textContent = infoHash
  }

  function hideLoading () {
    const loadingBox = document.querySelector('#loading')
    loadingBox.style.display = 'none'
  }

  function hideResponse () {
    // Hide response
    const resultsBox = document.querySelector('#results')
    resultsBox.style.display = 'none'
    const errorBox = document.querySelector('#error')
    errorBox.style.display = 'none'
  }
}
