const fs = require('fs');
const path = require('path');

/* Module export */
module.exports = {
	prepare: function(path) {
		if (!fs.existsSync(path)) {
			fs.mkdirSync(path, (err) => {
				if (err) {
					console.error("Cache: " + err);
				} else {
					console.log("Cache: Directory " + path +" created!");
				}
			});
		}
	},
	store: function(path, data) {
		fs.writeFileSync(path, data, (err) => {
		    if(err) {
		        console.error("Cache: " + err);
		    } else {
		    	console.log("Cache: New cache saved at " + path + "!");
		    }
		});
	}
}