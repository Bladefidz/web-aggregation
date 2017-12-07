const lowdb = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync')

module.exports = {
	instance: function() {
		let adapter = new FileSync(db)
		return lowdb(adapter);
	}
}