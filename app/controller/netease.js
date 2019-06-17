const rp = require('request-promise')
const cheerio = require('cheerio')

const func = require('../util/func')

class NeteaseController {
  static async recommendlist(ctx) {
    let page = ctx.params.page ? parseInt(ctx.params.page) : 1
    let pagesize = ctx.params.pagesize ? parseInt(ctx.params.pagesize) : 12
    let offset = (page - 1) * pagesize
    let options = {
      uri: 'https://music.163.com/discover/playlist',
      qs: { offset: offset, limit: pagesize }
    }

    let data = await rp(options).then(values => {
      let $ = cheerio.load(values)
      let songlist = []
      $('#m-pl-container li .u-cover').each((index, element) => {
        let listcover = $(element)
          .children('img')
          .attr('src')
        let listname = $(element)
          .children('a')
          .attr('title')
        let listUrl = $(element)
          .children('a')
          .attr('href')
        let listid = func.parseUrl(listUrl)['id']
        songlist.push({ listcover, listname, listid })
      })

      return {
        songlist: songlist
      }
    })

    ctx.body = { data: data }
  }

  static async newlist(ctx) {
    let form = func.weapi({ id: 3779629, n: 100, s: 10 })
    let options = {
      method: 'post',
      uri: 'https://music.163.com/weapi/v3/playlist/detail',
      form: form
    }

    let data = await rp(options).then(value => {
      let songs = []
      let originData = JSON.parse(value)
      let listcover = originData.playlist.coverImgUrl
      let listname = originData.playlist.name
      for (let v of originData.playlist.tracks) {
        let artist = []
        for (let val of v.ar) {
          artist.push(val.name)
        }
        songs.push({
          songid: v.id,
          artist: artist,
          songname: v.name,
          hasplayurl: true, type: 'netease'
        })
      }

      return {
        list: { listcover, listname, songs }
      }
    })

    ctx.body = { data: data }
  }

  static async hotlist(ctx) {
    let form = func.weapi({ id: 3778678, n: 100, s: 10 })
    let options = {
      method: 'post',
      uri: 'https://music.163.com/weapi/v3/playlist/detail',
      form: form
    }

    let data = await rp(options).then(value => {
      let songs = []
      let originData = JSON.parse(value)
      let listcover = originData.playlist.coverImgUrl
      let listname = originData.playlist.name
      for (let v of originData.playlist.tracks) {
        let artist = []
        for (let val of v.ar) {
          artist.push(val.name)
        }
        songs.push({
          songid: v.id,
          artist: artist,
          songname: v.name,
          hasplayurl: true, type: 'netease'
        })
      }

      return {
        list: { listcover, listname, songs }
      }
    })

    ctx.body = { data: data }
  }

  static async songlist(ctx) {
    let form = func.weapi({ id: parseInt(ctx.params.id), n: 10000, s: 10 })
    let options = {
      method: 'post',
      uri: 'https://music.163.com/weapi/v3/playlist/detail',
      form: form
    }

    let data = await rp(options).then(value => {
      let songs = []
      let originData = JSON.parse(value)
      let listcover = originData.playlist.coverImgUrl + '?param=150y150'
      let listname = originData.playlist.name
      let creatorname = originData.playlist.creator.nickname
      let creatoravatar = originData.playlist.creator.avatarUrl + '?param=40y40'
      let listdescription = originData.playlist.description
      for (let v of originData.playlist.tracks) {
        let artist = []
        for (let val of v.ar) {
          artist.push(val.name)
        }
        songs.push({
          songid: v.id,
          artist: artist,
          songname: v.name,
          hasplayurl: true,
          type: 'netease'
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
    let ids = ctx.params.ids.split(/\s*,\s*/)
    let song = await rp({
      method: 'post',
      uri: 'https://music.163.com/weapi/v3/song/detail',
      form: func.weapi({
        c: '[' + ids.map(value => '{id:' + value + '}').join(',') + ']',
        ids: '[' + ids.join(',') + ']'
      })
    })

    let songurl = await rp({
      method: 'post',
      uri: 'https://music.163.com/weapi/song/enhance/player/url',
      form: func.weapi({
        ids: '[' + ctx.params.ids + ']',
        br: 999000
      })
    })

    let lyric = await rp({
      method: 'post',
      uri: 'https://music.163.com/weapi/song/lyric',
      form: func.weapi({
        id: ctx.params.ids,
        lv: -1,
        kv: -1,
        tv: -1
      })
    })

    let data = await Promise.all([song, songurl, lyric]).then(values => {
      let id = JSON.parse(values[0]).songs[0].id
      let name = JSON.parse(values[0]).songs[0].name
      let originArtist = JSON.parse(values[0]).songs[0].ar
      let artist = []
      for (let v of originArtist) {
        artist.push(v.name)
      }
      let cover = JSON.parse(values[0]).songs[0].al.picUrl + '?param=300y300'
      let playurl = JSON.parse(values[1]).data[0].url
        ? JSON.parse(values[1]).data[0].url
        : ''
      let lyric = JSON.parse(values[2]).lrc
        ? JSON.parse(values[2]).lrc.lyric
        : ''

      return {
        song: {
          id,
          name,
          artist,
          cover,
          playurl,
          lyric,
          type: 'netease'
        }
      }
    })
    ctx.body = { data: data }
  }
}

module.exports = NeteaseController
