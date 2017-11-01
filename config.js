const isProd = (process.env.NODE_ENV === 'production')

/**
* Is site running in production?
**/
exports.isProd = isProd

/**
* Server listening port
**/
exports.port = isProd
  ? 4000
  : 4000
