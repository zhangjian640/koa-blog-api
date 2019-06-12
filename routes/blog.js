const router = require('koa-router')()
const { getList, getDetail, newBlog, updateBlog, deleteBlog } = require('../controller/blog')
const { SuccessModel, ErrorModel } = require('../model/resModel')
const loginCheck = require('../middleware/loginCheck')
router.prefix('/api/blog')

// 列表
router.get('/list', async (ctx, next) => {
	let author = ctx.query.author || ''
	const keyword = ctx.query.keyword || ''
	if (ctx.query.isadmin) {
		if (ctx.session.username == null) {
			ctx.body = new ErrorModel('未登录')
			return
		}
	}
	const result = await getList(author, keyword)
	ctx.body = new SuccessModel(result)
})

// 详情
router.get('/detail', async (ctx, next) => {
	const id = ctx.query.id
	if (!id) {
		ctx.body = new ErrorModel('id为空')
	}
	const result = await getDetail(id)
	ctx.body = new SuccessModel(result)
})

// 新建
router.post('/new', loginCheck, async(ctx, next) => {
	ctx.request.body.author = ctx.session.username
	const result = await newBlog(ctx.request.body)
	if (result) {
		ctx.body = new SuccessModel(result)
	} else {
		ctx.body = new ErrorModel('新建失败')
	}
})

// 更新
router.post('/update', loginCheck, async (ctx, next) => {
	const id = ctx.query.id
	const result = await updateBlog(id, ctx.request.body)
	if (result) {
		ctx.body = new SuccessModel(result)
	} else {
		ctx.body = new ErrorModel('更新失败')
	}
})

// 删除
router.post('/delete', loginCheck, async (ctx, next) => {
	const id = ctx.query.id
	const author = ctx.session.username
	const result = await deleteBlog(id, author)
	if (result) {
		ctx.body = new SuccessModel(result)
	} else {
		ctx.body = new ErrorModel('删除失败')
	}
})

module.exports = router
