const fs = require('fs');

class Text {
    constructor (file) {
        this.file = file;
    }

    write(data) {
        data = JSON.stringify(data);
        if (fs.existsSync(path)) {
            fs.writeFileSync(this.file, data, function(err) {
                if(err) {
                    return console.error(err);
                }
            });
        } else {
            fs.appendFileSync(this.file, data, (err) => {
                if (err) throw err;
            });
        }

        console.info("Output: " + this.file + "updated!");
    }
}

module.exports = Text;