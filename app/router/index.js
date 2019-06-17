const Router = require('koa-router')
const netease = require('../controller/netease')
const qq = require('../controller/qq')
const kugou = require('../controller/kugou')

const router = new Router({
  prefix: '/api'
})

router.get('/netease/recommendlist/:page/:pagesize', netease.recommendlist)
router.get('/netease/newlist', netease.newlist)
router.get('/netease/hotlist', netease.hotlist)
router.get('/netease/songlist/:id', netease.songlist)
router.get('/netease/songdetail/:ids', netease.songdetail)

router.get('/qq/recommendlist/:page/:pagesize', qq.recommendlist)
router.get('/qq/newlist', qq.newlist)
router.get('/qq/hotlist', qq.hotlist)
router.get('/qq/songlist/:id', qq.songlist)
router.get('/qq/songdetail/:ids', qq.songdetail)

router.get('/kugou/recommendlist/:page/:pagesize', kugou.recommendlist)
router.get('/kugou/newlist', kugou.newlist)
router.get('/kugou/hotlist', kugou.hotlist)
router.get('/kugou/songlist/:id', kugou.songlist)
router.get('/kugou/songdetail/:ids', kugou.songdetail)

module.exports = router
