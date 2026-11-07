# Webtorrent Checker

[![Build Status][webtorrent-checker-bi]][webtorrent-checker-bu]
[![Standard - Javascript Style Guide][standard-image]][standard-url]

Check the health of a torrent in Webtorrent and BitTorrent

LIVE: [https://checker.openwebtorrent.com](https://checker.openwebtorrent.com)

## Build

```sh
npm install
npm run build
```

`npm run build` bundles the client (`client/`) into `static/bundle.js`, which
is what browsers load. The bundle isn't in git, so run it again after every
change to `client/` or to the dependencies, or the site keeps serving the old
code. (`npm build` without `run` is not the same thing: since npm 7 it's an
unknown command and builds nothing.)

## Usage

```sh
npm start
```

## License

MIT. Copyright (c) [Alex](http://github.com/alxhotel)

[webtorrent-checker-bi]: https://img.shields.io/github/actions/workflow/status/alxhotel/webtorrent-checker/ci.yml?branch=master
[webtorrent-checker-bu]: https://github.com/alxhotel/webtorrent-checker/actions
[standard-image]: https://img.shields.io/badge/code_style-standard-brightgreen.svg
[standard-url]: https://standardjs.com
