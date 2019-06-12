const router = require('koa-router')()
const {login, register} = require('../controller/user')
const {SuccessModel, ErrorModel} = require('../model/resModel')

router.prefix('/api/user')

// 测试session
router.get('/session-test', async (ctx, body) => {
  if (ctx.session.viewCount == null) {
    ctx.session.viewCount = 0
  }
  ctx.session.viewCount++
  ctx.body = {
    code: 0,
    viewCount: ctx.session.viewCount
  }
})

router.post('/login', async (ctx, next) => {
  const {username, password} = ctx.request.body
  const loginData = await login(username, password)
  if (loginData.username) {
    ctx.session.username = loginData.username
    ctx.session.realname = loginData.realname

    ctx.body =new SuccessModel(loginData)
    return
  }
  ctx.body = new ErrorModel('该用户名已注册')
})

router.post('/register', async (ctx, next) => {
  const {username, password, realname} = ctx.request.body
  const loginData = await register(username, password, realname)
  if (loginData.id) {
    ctx.body = new SuccessModel(loginData)
    return
  }
  ctx.body = new ErrorModel('该用户名已注册')
})

module.exports = router
