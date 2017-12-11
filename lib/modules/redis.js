var redis = require('./redis');

exports.set = setUserProfile;
exports.get = getUserProfile;

function setUserProfile(userId, profile, cb) {  
  redis.hmset('profile:' + userId, profile, cb);
}

function getUserProfile(userId, cb) {  
  redis.hgetall('profile:' + userId, cb);
}