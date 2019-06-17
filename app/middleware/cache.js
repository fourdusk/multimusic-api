const cache = require('koa-cache-lite')

const cacheTimeout = 120000
cache.configure(
  {
    '/api/netease/recommendlist/:page/:pagesize': {
      timeout: cacheTimeout
    },
    '/api/netease/newlist': {
      timeout: cacheTimeout
    },
    '/api/netease/hotlist': {
      timeout: cacheTimeout
    },
    '/api/netease/songlist/:id': {
      timeout: cacheTimeout
    },
    '/api/netease/songdetail/:ids': {
      timeout: cacheTimeout
    },
    '/api/qq/recommendlist/:page/:pagesize': {
      timeout: cacheTimeout
    },
    '/api/qq/newlist': {
      timeout: cacheTimeout
    },
    '/api/qq/hotlist': {
      timeout: cacheTimeout
    },
    '/api/qq/songlist/:id': {
      timeout: cacheTimeout
    },
    '/api/qq/songdetail/:ids': {
      timeout: cacheTimeout
    },
    '/api/kugou/recommendlist/:page/:pagesize': {
      timeout: cacheTimeout
    },
    '/api/kugou/newlist': {
      timeout: cacheTimeout
    },
    '/api/kugou/hotlist': {
      timeout: cacheTimeout
    },
    '/api/kugou/songlist/:id': {
      timeout: cacheTimeout
    },
    '/api/kugou/songdetail/:ids': {
      timeout: cacheTimeout
    }
  },
  {
    debug: true
  }
)

module.exports = cache.middleware()
