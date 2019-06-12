const {exec, escape} = require('../db/mysql')
const { genPassword } = require('../utils/crypto')
async function checkUser(username) {
	const sql = `select username from users where username=${username};`
	const rows = await exec(sql)
	return rows[0] || ''
}

// 注册
const register = async (username, password, realname) => {
	username = escape(username)
	password = genPassword(password)
	password = escape(password)
	realname = escape(realname)
	const result = await checkUser(username)
	if (result) {
		const sql = `insert into users (username, password, realname) values (${username}, ${password}, ${realname});`
		const res = await exec(sql)
		return {
			id: res.insertId
		}
	} else {
		return Promise.resolve({id: ''})
	}
}

// 登录
const login = async (username, password) => {
	username = escape(username)
	password = genPassword(password)
	password = escape(password)
	const sql = `select username, realname from users where username=${username} and password=${password};`
	const rows = await exec(sql)
	return rows[0] || {}
}

module.exports = { login, register }
