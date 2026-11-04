/* global btoa, atob */
// uint8-util (used by parse-torrent, bencode and magnet-uri) relies on the
// native Uint8Array hex/base64 helpers, which are only available in recent
// browsers (Chrome 140+, Firefox 133+, Safari 18.2+). Polyfill them so older
// browsers keep working.

if (typeof Uint8Array.prototype.toHex !== 'function') {
  // eslint-disable-next-line no-extend-native
  Object.defineProperty(Uint8Array.prototype, 'toHex', {
    configurable: true,
    writable: true,
    value: function toHex () {
      let out = ''
      for (let i = 0; i < this.length; i++) {
        out += (this[i] < 16 ? '0' : '') + this[i].toString(16)
      }
      return out
    }
  })
}

if (typeof Uint8Array.fromHex !== 'function') {
  Object.defineProperty(Uint8Array, 'fromHex', {
    configurable: true,
    writable: true,
    value: function fromHex (str) {
      if (typeof str !== 'string') throw new TypeError('Expected a string')
      if (str.length % 2 !== 0 || /[^0-9a-f]/i.test(str)) throw new SyntaxError('Invalid hex string')
      const out = new Uint8Array(str.length / 2)
      for (let i = 0; i < out.length; i++) {
        out[i] = parseInt(str.substr(i * 2, 2), 16)
      }
      return out
    }
  })
}

if (typeof Uint8Array.prototype.toBase64 !== 'function') {
  // eslint-disable-next-line no-extend-native
  Object.defineProperty(Uint8Array.prototype, 'toBase64', {
    configurable: true,
    writable: true,
    value: function toBase64 () {
      let binary = ''
      for (let i = 0; i < this.length; i += 0x8000) {
        binary += String.fromCharCode.apply(null, this.subarray(i, i + 0x8000))
      }
      return btoa(binary)
    }
  })
}

if (typeof Uint8Array.fromBase64 !== 'function') {
  Object.defineProperty(Uint8Array, 'fromBase64', {
    configurable: true,
    writable: true,
    value: function fromBase64 (str) {
      if (typeof str !== 'string') throw new TypeError('Expected a string')
      const binary = atob(str)
      const out = new Uint8Array(binary.length)
      for (let i = 0; i < binary.length; i++) out[i] = binary.charCodeAt(i)
      return out
    }
  })
}
