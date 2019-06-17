const rp = require('request-promise')

class QQController {
  static async recommendlist(ctx) {
    let page = ctx.params.page ? parseInt(ctx.params.page) : 1
    let pagesize = ctx.params.pagesize ? parseInt(ctx.params.pagesize) : 12
    let options = {
      uri: 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg',
      qs: {
        format: 'json',
        categoryId: 10000000,
        sin: (page - 1) * pagesize,
        ein: page * pagesize,
        inCharset: 'utf8',
        outCharset: 'utf-8'
      },
      headers: {
        referer: 'y.qq.com'
      }
    }

    let data = await rp(options).then(value => {
      let originData = JSON.parse(value).data.list
      let songlist = []
      for (let v of originData) {
        songlist.push({
          listcover: v.imgurl.replace('/600?', '/150?'),
          listname: v.dissname,
          listid: v.dissid
        })
      }
      return { songlist: songlist.slice(0, songlist.length - 1) }
    })

    ctx.body = { data: data }
  }

  static async newlist(ctx) {
    let qsData = {
      comm: {
        format: 'json',
        inCharset: 'utf-8',
        outCharset: 'utf-8'
      },
      detail: {
        module: 'musicToplist.ToplistInfoServer',
        method: 'GetDetail',
        param: { topId: 27, offset: 0, num: 100 }
      }
    }
    let options = {
      uri: 'https://u.y.qq.com/cgi-bin/musicu.fcg',
      qs: { data: JSON.stringify(qsData) }
    }
    let data = await rp(options).then(value => {
      let originData = JSON.parse(value)
      let songs = []
      let listcover = originData.detail.data.data.mbFrontPicUrl
      let listname = originData.detail.data.data.title
      for (let v of originData.detail.data.songInfoList) {
        let artist = []
        for (let val of v.singer) {
          artist.push(val.name)
        }
        songs.push({
          songid: v.id,
          artist: artist,
          songname: v.name,
          hasplayurl: true,
          type: 'qq'
        })
      }
      return {
        list: { listcover, listname, songs }
      }
    })

    ctx.body = { data: data }
  }

  static async hotlist(ctx) {
    let qsData = {
      comm: {
        format: 'json',
        inCharset: 'utf-8',
        outCharset: 'utf-8'
      },
      detail: {
        module: 'musicToplist.ToplistInfoServer',
        method: 'GetDetail',
        param: { topId: 26, offset: 0, num: 100 }
      }
    }
    let options = {
      uri: 'https://u.y.qq.com/cgi-bin/musicu.fcg',
      qs: { data: JSON.stringify(qsData) }
    }
    let data = await rp(options).then(value => {
      let originData = JSON.parse(value)
      let songs = []
      let listcover = originData.detail.data.data.mbFrontPicUrl
      let listname = originData.detail.data.data.title
      for (let v of originData.detail.data.songInfoList) {
        let artist = []
        for (let val of v.singer) {
          artist.push(val.name)
        }
        songs.push({
          songid: v.id,
          artist: artist,
          songname: v.name,
          hasplayurl: true,
          type: 'qq'
        })
      }
      return {
        list: { listcover, listname, songs }
      }
    })

    ctx.body = { data: data }
  }

  static async songlist(ctx) {
    let data = await rp({
      method: 'post',
      uri: 'https://szc.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg',
      headers: {
        referer: 'y.qq.com'
      },
      form: {
        format: 'json',
        inCharset: 'utf-8',
        outCharset: 'utf-8',
        disstid: parseInt(ctx.params.id),
        type: 1
      }
    }).then(value => {
      let originData = JSON.parse(value)
      let songs = []
      let listcover = originData.cdlist[0].logo.replace('/300?', '/150?')
      let listname = originData.cdlist[0].dissname
      let creatorname = originData.cdlist[0].nickname
      let creatoravatar = originData.cdlist[0].headurl.replace('s=140', 's=40')
      let listdescription = originData.cdlist[0].desc
      for (let v of originData.cdlist[0].songlist) {
        let artist = []
        for (let val of v.singer) {
          artist.push(val.name)
        }
        songs.push({
          songid: v.songid,
          artist: artist,
          songname: v.songname,
          hasplayurl: true,
          type: 'qq'
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
    })

    ctx.body = { data: data }
  }

  static async songdetail(ctx) {
    let song = await rp({
      uri: 'https://u.y.qq.com/cgi-bin/musicu.fcg',
      qs: {
        data: JSON.stringify({
          comm: {
            format: 'json',
            inCharset: 'utf-8',
            outCharset: 'utf-8'
          },
          detail: {
            module: 'music.pf_song_detail_svr',
            method: 'get_song_detail',
            param: { song_id: parseInt(ctx.params.ids) }
          }
        })
      }
    }).then(values => JSON.parse(values))

    let songurl = await rp({
      uri: 'https://u.y.qq.com/cgi-bin/musicu.fcg',
      qs: {
        data: JSON.stringify({
          comm: {
            format: 'json',
            inCharset: 'utf-8',
            outCharset: 'utf-8'
          },
          detail: {
            module: 'vkey.GetVkeyServer',
            method: 'CgiGetVkey',
            param: {
              guid: '0',
              songmid: [song.detail.data.track_info.mid],
              uin: '0'
            }
          }
        })
      }
    }).then(value => JSON.parse(value))

    let id = song.detail.data.track_info.id
    let name = song.detail.data.track_info.name
    let originArtist = song.detail.data.track_info.singer
    let artist = []
    for (let v of originArtist) {
      artist.push(v.name)
    }
    let cover =
      'https://y.gtimg.cn/music/photo_new/T002R300x300M000' +
      song.detail.data.track_info.album.mid +
      '.jpg'
    let playurl =
      'https://dl.stream.qqmusic.qq.com/' +
        songurl.detail.data.midurlinfo[0].purl || ''
    let findlyric = song.detail.data.info.find(value => {
      return value.type === 'lyric'
    })
    let lyric = findlyric ? findlyric.content[0].value : ''

    ctx.body = {
      data: {
        song: {
          id,
          name,
          artist,
          cover,
          playurl,
          lyric,
          type: 'qq'
        }
      }
    }
  }
}

module.exports = QQController
