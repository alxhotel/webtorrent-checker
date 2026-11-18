require('./polyfills')

require('./theme')()

const pathname = window.location.pathname
if (pathname === '/') require('./views/index')()
