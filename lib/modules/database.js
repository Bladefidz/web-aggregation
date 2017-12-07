const lowdb = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync')
const csvdb = require('csvdb');

/* Function declarations */
/* Json */
function jsonPrepare(db, format) {
	if (format == null) {
		format = {result: []};
	}
	db.defaults(format).write();
}

function jsonIsert(db, data) {

}


/* Module export */
module.exports = {
	getDb: function(type, db) {
		if (type == "json") {
			let adapter = new FileSync(db)
			let db = low(adapter);
			return { type: "json", db: db };
		} else if (type == "csv") {

		} else if (type == "mongodb") {

		} else if (type == "mysql") {

		} else {
			console.log("Database typ %s is not supported!", type);
		}
	},
	insert: function(dbins, data) {
		if (dbins.type == "json") {
			jsonIsert(dbins.db, data);
		}
	}
}