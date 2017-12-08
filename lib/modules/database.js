const lowdb = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const csvdb = require('csvdb');

/* Function declarations */
/* Json */
/**
 * Prepare json file and define its format
 * @param  {object} db     lowdb object
 * @param  {object} format Output format
 */
function jsonPrepare(db, format) {
	if (format == null) {
		format = {result: []};
	}
	db.defaults(format).write();
}

/**
 * Write new data into json file
 * @param  {object} db   lowdb object
 * @param  {object} data Data to write
 */
function jsonIsert(db, data) {
	db.get('posts')
		.push(data)
		.write()
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