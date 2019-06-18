const rp = require('request-promise')

class KugouController {
  static async recommendlist(ctx) {
    let page = ctx.params.page ? parseInt(ctx.params.page) : 1
    let pagesize = ctx.params.pagesize ? parseInt(ctx.params.pagesize) : 12
    let options = {
      uri: 'http://mobilecdn.kugou.com/api/v3/category/special',
      qs: { page: page, pagesize: pagesize }
    }

    let data = await rp(options).then(value => {
      let originData = JSON.parse(value).data.info
      let songlist = []
      for (let v of originData) {
        songlist.push({
          listcover: v.imgurl.replace('{size}', 150),
          listname: v.specialname,
          listid: v.specialid
        })
      }
      return { songlist: songlist }
    })

    ctx.body = { data: data }
  }

  static async newlist(ctx) {
    let listCoverName = await rp({
      uri: 'http://m.kugou.com/rank/info/31308',
      qs: { json: true }
    })

    let listSong = await rp({
      uri: 'http://mobilecdn.kugou.com/api/v3/rank/song',
      qs: {
        rankid: 31308,
        pagesize: 100
      }
    })

    let data = await Promise.all([listCoverName, listSong]).then(values => {
      let coverName = JSON.parse(values[0])
      let song = JSON.parse(values[1])
      let listcover = coverName.info.imgurl.replace('{size}', 400)
      let listname = coverName.info.rankname
      let songs = []
      for (let v of song.data.info) {
        let artist = []
        let filenameArr = v.filename.split('-')
        let originArtist = filenameArr[0].trim()
        let songname = filenameArr[1].trim()
        for (let val of originArtist.split('、')) {
          artist.push(val)
        }
        songs.push({
          songid: v.hash,
          artist: artist,
          songname: songname,
          hasplayurl: true,
          type: 'kugou'
        })
      }
      return {
        list: { listcover, listname, songs }
      }
    })

    ctx.body = { data: data }
  }

  static async hotlist(ctx) {
    let listCoverName = await rp({
      uri: 'http://m.kugou.com/rank/info/8888',
      qs: { json: true }
    })

    let listSong = await rp({
      uri: 'http://mobilecdn.kugou.com/api/v3/rank/song',
      qs: {
        rankid: 8888,
        pagesize: 100
      }
    })

    let data = await Promise.all([listCoverName, listSong]).then(values => {
      let coverName = JSON.parse(values[0])
      let song = JSON.parse(values[1])
      let listcover = coverName.info.imgurl.replace('{size}', 400)
      let listname = coverName.info.rankname
      let songs = []
      for (let v of song.data.info) {
        let artist = []
        let filenameArr = v.filename.split('-')
        let originArtist = filenameArr[0].trim()
        let songname = filenameArr[1].trim()
        for (let val of originArtist.split('、')) {
          artist.push(val)
        }
        songs.push({
          songid: v.hash,
          artist: artist,
          songname: songname,
          hasplayurl: true,
          type: 'kugou'
        })
      }
      return {
        list: { listcover, listname, songs }
      }
    })

    ctx.body = { data: data }
  }

  static async songlist(ctx) {
    let listCover = await rp({
      uri: 'http://m.kugou.com/plist/list/' + String(ctx.params.id),
      qs: { json: true }
    })

    let getAvatar = await rp({
      method: 'post',
      uri: 'http://kmrserviceretry.kugou.com/container/v1/collection',
      body: {
        appid: 0,
        clientver: 0,
        mid: 0,
        clienttime: 0,
        key: 0,
        collection_ids: parseInt(ctx.params.id)
      },
      json: true
    })

    let listSong = await rp({
      uri: 'http://mobilecdn.kugou.com/api/v3/special/song',
      qs: {
        pagesize: -1,
        specialid: parseInt(ctx.params.id)
      }
    })

    let data = await Promise.all([listCover, getAvatar, listSong]).then(
      values => {
        let cover = JSON.parse(values[0])
        let song = JSON.parse(values[2])
        let listcover = cover.info.list.imgurl.replace('{size}', 150)
        let listname = cover.info.list.specialname
        let creatorname = cover.info.list.nickname
        let creatoravatar = values[1].data[0].user_avatar.replace(
          '/165/',
          '/60/'
        )
        let listdescription = cover.info.list.intro
        let songs = []
        for (let v of song.data.info) {
          let artist = []
          let filenameArr = v.filename.split('-')
          let originArtist = filenameArr[0].trim()
          let songname = filenameArr[1].trim()
          for (let val of originArtist.split('、')) {
            artist.push(val)
          }
          songs.push({
            songid: v.hash,
            artist: artist,
            songname: songname,
            hasplayurl: true,
            type: 'kugou'
          })
        }
        return {
          list: {
            listcover,
            listname,
            creatorname,
            creatoravatar,
            listdescription,
            songs
          }
        }
      }
    )

    ctx.body = { data: data }
  }

  static async songdetail(ctx) {
    let song = await rp({
      uri: 'https://m3ws.kugou.com/api/v1/song/get_song_info',
      qs: {
        cmd: 'playInfo',
        hash: ctx.params.ids
      }
    })

    let lyric = await rp({
      uri: 'https://m3ws.kugou.com/app/i/krc.php',
      qs: {
        cmd: 100,
        timelength: 1,
        hash: ctx.params.ids
      }
    })

    let data = await Promise.all([song, lyric]).then(value => {
      let song = JSON.parse(value[0])
      let lyric = value[1]
      let id = song.hash
      let name = song.songName
      let artist = song.singerName
      let cover = song.imgUrl.replace('{size}', 400)
      let playurl = song.url
      return {
        song: {
          id,
          name,
          artist,
          cover,
          playurl,
          lyric,
          type: 'kugou'
        }
      }
    })

    ctx.body = { data: data }
  }
}

module.exports = KugouController
