const chars = "abcdefghijklmnopqrstuvwxyz";
const nums = "0123456789";
const charLength = 26;

module.exports = {
    alpha:function(length, caps = null) {
        let result = "";
        let random = "";

        if (caps == "big") {
            chars = chars.toUpperCase();
        }

        if (caps == null) {
            random = chars + chars.toUpperCase();
            charLength = charLength * 2;
        }

        for (let i = 0; i < length; i++) {
            result += random[Math.floor(Math.random() * charLength)];
        }

        return result;
    },
    numeric:function(length) {
        let result = "";

        for (let i = 0; i < length; i++) {
            result += nums[Math.floor(Math.random() * nums.length)];
        }

        return result;
    },
    alphanumeric:function(length) {
        let result = "";
        let random = chars + chars.toUpperCase() + nums;

        for (let i = 0; i < length; i++) {
            result += random[Math.floor(Math.random() * random.length)];
        }

        return result;
    }
}