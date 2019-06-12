const xss = require('xss')
const { exec, escape } = require('../db/mysql')

const getList = async (author, keyword) => {
	author = escape(author)
	let sql = `select * from blogs where 1=1 `
	if (!author === '') {
		sql += `and author=${author} `
	}
	if (keyword) {
		sql += `and title like '%${keyword}%' `
	}
	sql += `order by createtime desc;`
	return await exec(sql)
}

const getDetail = async (id) => {
	const sql = `select * from blogs where id=${id};`
	const row = await exec(sql)
	return row[0]
}

const newBlog = async (blogData = {}) => {
	let {title, content, author} = blogData
	title = xss(escape(title))
	content = xss(escape(content))
	author = xss(escape(author))
	const createtime = Date.now()
	const sql = `insert into blogs (title, content, createtime, author) values (${title}, ${content}, '${createtime}', ${author});`
	const res = await exec(sql)
	return {
		id: res.insertId
	}
}

const updateBlog = async (id, blogData = {}) => {
	let {title, content} = blogData
	title = xss(escape(title))
	content = xss(escape(content))
	const sql = `update blogs set title=${title}, content=${content} where id='${id}';`
	const updateData = await exec(sql)
	return updateData.affectedRows > 0
}

const deleteBlog = async (id, author) => {
	author = escape(author)
	const sql = `delete from blogs where id='${id}' and author=${author};`
	const deleteData = await exec(sql)
	return deleteData.affectedRows > 0
}

module.exports = { getList, getDetail, newBlog, updateBlog, deleteBlog }
