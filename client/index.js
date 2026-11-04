require('./polyfills')

const pathname = window.location.pathname
if (pathname === '/') require('./views/index')()
