async function errorHandle(ctx, next) {
  try {
    await next()
  } catch (err) {
    ctx.status = err.status || 500
    ctx.body = {
      code: err.status,
      message: err.message
    }
    ctx.app.emit('error', err, ctx)
  }
}

module.exports = function() {
  return async function(ctx, next) {
    await errorHandle(ctx, next)
  }
}
