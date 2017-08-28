const random = require('./random');

module.exports = {
    parse: function(command) {
        let parsed = command;
        command = command.split(/[\s.]+/);

        if (command[0] == '>Random') {
            if (command[1] == 'alphanumeric') {
                parsed = random.alphanumeric(parseInt(command[2]));
            } else if (command[1] == 'alpha') {
                parsed = random.alpha(parseInt(command[2]));
            } else if (command[1] == 'numeric') {
                parsed = random.numeric(parseInt(command[2]));
            }
        }

        return parsed;
    }
}