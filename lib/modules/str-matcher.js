module.exports = {
    seqMatch: function(s1, s2) {
    	if (s1.length != s2.length) {
    		return false;
    	}
    	let v = true;
    	for (let i = 0; i < s1.length; i++) {
    		if (s1[i] != s2[i]) {
    			v = false;
    			break;
    		}
    	}
    	return v;
    },
    offsetMatch: function (s1, s2, offset) {
    	if (offset + s2.length > s1.length) {
    		return false;
    	}
    	let v = true;
    	for (let i = 0; i < s2.length; i++) {
    		if (s1[offset++] != s2[i]) {
    			v = false;
    			break;
    		}
    	}
    	return v;
    }
}