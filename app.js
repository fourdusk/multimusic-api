const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const cors = require('@koa/cors')

const router = require('./app/router')
const errorHandle = require('./app/middleware/errorHandle')
const cache = require('./app/middleware/cache')

const app = new Koa()

app.use(errorHandle())
app.use(bodyParser())
app.use(cors())
app.use(cache)
app.use(router.routes())
app.use(router.allowedMethods())

app.on('error', (err, ctx) => {
  console.log(err)
})

app.listen(3000, () => {
  console.log('nodejs is running.')
})
