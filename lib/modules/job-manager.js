const config = require('./config');
const command = require('./command');
const object = require('./object');
const strMathcer = require('./str-matcher');
const selector = require('./selector');
const output = require('./output');
const cache = require('./cache');
const request = require('request');
const fs = require('fs');
const path = require('path');
const redis = require('redis').createClient();
const kue = require('kue');
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

/* Global variable declarations */
const queue = kue.createQueue();
const ignoredReqOptions = ["selector", "id", "fillable", "crawl"];

/* Job queue configurations */
// run watchdog to fix unstable redis connection
queue.watchStuckJobs();
queue.on('ready', () => {
    console.info('Job-Manager: Queue is ready!');
});
queue.on('error', (err) => {
    console.error('Job-Manager: There was an error in the main queue!');
    console.error(err);
    console.error(err.stack);
});

/* Mongo DB configuration */
const dbUrl = "mongodb://localhost:27017";
const dbName = "scrape-jobs";

/**
 * Load request enumerator from file
 * @param  {string} fl   Path to file
 * @return {Object}      List of lines
 */
function getEnumeratorFile(fl) {
    let f = fs.readFileSync(
        path.join(__dirname, '..', '..', 'input', fl),
        'utf8'
    );
    return f.split('\n');
}

/**
 * Retrun string of digit within range (from, to)
 * @param  {string} from Initial range
 * @param  {string} to   Last range
 */
function getEnumeratorDigit(from, to, length, defaultStr) {
    let digits = [];
    let i = parseInt(from);
    let j = parseInt(to);
    for (; i <= j; i++) {
        let d = i.toString();
        for (let k = 0; k < length - d.length; k++) {
            d = defaultStr + d;
        }
        digits.push(d);
    }
    return digits;
}

/**
 * Check if request is valid
 * @return {Boolean}
 */
function isRequestValid(req) {
    if (req.hasOwnProperty('url') ||
        req.hasOwnProperty('uri') ||
        req.hasOwnProperty('baseUrl')
    ) {
        return true;
    }
    return false;
}

/**
 * Get request id
 * @param  {[type]} req [description]
 * @return {[type]}     [description]
 */
function getRequestId(jreq) {
    let rtype = typeof jreq;
    if (rtype == "object") {
        return Object.keys(jreq)[0];
    }
    return jreq;
}

/**
 * Get request configuration defined in job
 * @param  {[type]} jreq [description]
 * @param  {[type]} id   [description]
 * @return {[type]}      [description]
 */
function getJobRequestConf(jreq, id) {
    let rtype = typeof jreq;
    if (rtype == "object") {
        return jreq[id];
    }
    return null;
}

/**
 * Parse fill of request
 * @param  {object} fargs 		Object of fillable
 * @param  {String} currEnum  	Current enumerator
 */
function parseRequestFill(fargs, currEnum) {
    for (f in fargs) {
        if (typeof fargs[f] == "string") {
            if (fargs[f][0] == '>') {
                if (strMathcer.offsetMatch(fargs[f], "enumerator", 1)) {
                	if (currEnum != null) {
                        fargs[f] = currEnum;
                	}
                }
            }
        }
    }
}

/**
 * Fill request by given fill argument
 * @param  {Object} req  Request object
 * @param  {Array}  farg Fill arguments
 */
function fillRequest(req, farg) {
    let freq = req.fillable;
    for (let i = 0; i < freq.length; i++) {
        if (farg.hasOwnProperty(freq[i])) {
            let f = freq[i].split('.');
            object.modifies(req, f, farg[freq[i]]);
        }
    }
}

/**
 * Parse query string
 * @param  {object} qs       Query string
 * @return {object}          JSON object
 */
function getQueryString(qs) {
    for (let key in qs) {
        if (qs[key][0] == '>') {
            qs[key] = command.parse(qs[key]);
        }
    }

    return qs;
}

/**
 * Is given request option should be ignored?
 * @param  {string}  opt Option key
 * @return {Boolean}     Ignored or not
 */
function isIgnoredReqOption(opt) {
    for (i = 0; i < ignoredReqOptions.length; i++) {
        if (ignoredReqOptions[i] == opt) {
            return true;
            break;
        }
    }
    return false;
}

/**
 * Get job configuration
 * @param  {Object} req    				Object of request template
 * @param  {Object} jreq                Job request object
 * @param  {String} currEnum    		Current enumerator
 * @return {Object}       				Configured request job
 */
function getJobRequest(req, jreq, currEnum) {
    if (isRequestValid(req)) {
        if (jreq != null) {
            if (req.hasOwnProperty('fillable') &&
                jreq.hasOwnProperty('fill')
            ) {
                let fill = jreq.fill;
                parseRequestFill(fill, currEnum);
                fillRequest(req, fill);
            }
        }

        let rconf = Object.assign({}, config.getRequestConfiguration());
	    for (k in req) {
	        if (isIgnoredReqOption(k)) {
	            continue;
	        }

	        if (!rconf.hasOwnProperty(k)) {
	            rconf[k] = req[k];
	        } else {
	            if (k == "headers") {
	                for (l in req.headers) {
	                    rconf.headers[l] = req.headers[l];
	                }
	            }
	        }
	    }

	    if (req.hasOwnProperty('qs')) {
	        rconf.qs = getQueryString(req.qs);
	    }

	    return rconf;
    }
    return null;
}

/**
 * [saveJob description]
 * @param  {[type]} job [description]
 * @return {[type]}     [description]
 */
function saveJob(job) {
    MongoClient.connect(dbUrl, function(err, client) {
        if (err) throw err;
        const db = client.db(dbName);
        db.collection("jobs").insertOne(job, function(err, res) {
            if (err) throw err;
            console.log("Job-Manager: New job data of job saved in the database.");
            client.close();
        });
    });
}

/**
 * [getJob description]
 * @param  {[type]} id [description]
 * @return {[type]}    [description]
 */
function getJobRun(id, func) {
    MongoClient.connect(dbUrl, function(err, client) {
        if (err) throw err;
        const db = client.db(dbName);
        db.collection("jobs").findOne({_id: id}, function(err, res) {
            func(res, err);
            client.close();
        });
    });
}

/**
 * [runRequest description]
 * @param  {[type]} data [description]
 * @param  {[type]} out  [description]
 * @return {[type]}      [description]
 */
function runRequest(data, fn) {
    request(data.req, function (error, response, body) {
        if (data.hasOwnProperty('selector')) {
            body = selector.run(
                response,
                body,
                data.selector
            );
        }

        fn(body, error);
    });
}

/**
 * [deleteJob description]
 * @param  {[type]} id [description]
 * @return {[type]}    [description]
 */
function deleteJob(id) {
    MongoClient.connect(dbUrl, function(err, client) {
        if (err) throw err;
        const db = client.db(dbName);
        db.collection("jobs").deleteOne({_id: id}, function(err, obj) {
            if (err) throw err;
            client.close();
        });
    });
}

/* Module export */
module.exports = {
	parseJob: function(job, id) {
		if (!job.hasOwnProperty('type')) {
            job.type = "static";
        }

        if (job.type == "enum") {
            let t = job.enumerator.type;
            if (t == "file") {
                job.enumerator = getEnumeratorFile(job.enumerator.path);
            } else if (t == "digit") {
                job.enumerator = getEnumeratorDigit(
                    job.enumerator.from, job.enumerator.to,
                    job.enumerator.length, job.enumerator.default);
            }
        }

        if (!job.hasOwnProperty('status')) {
            job.status = 1;
        }

        if (!job.hasOwnProperty('priority')) {
            job.priority = "normal";
        }

        let jobConf = config.getJobConfig();

        if (!job.hasOwnProperty('delay')) {
            job.delay = jobConf.delay;
        }

        if (!job.hasOwnProperty('thread')) {
            job.thread = jobConf.thread;
        }

        if (!job.hasOwnProperty('output')) {
            job.output = {type: "stdout"};
        }

        if (!job.output.hasOwnProperty('name')) {
        	job.output.name = id;
        }

        if (!job.hasOwnProperty("cache")) {
            job.cache = null;
        } else {
            if (job.cache == 1) {
                job.cache = path.join(__dirname, '..', '..', 'output',
                    'cache', id);
                cache.prepare(job.cache);
            } else {
                job.cache = null;
            }
        }
    },
	run: function(procid, j, requestTemplates) {
        let out;
        if (j.output.type != "stdout") {
            let fn = path.join(__dirname, '..', '..', 'output',
                j.output.name);
            out = output.get(j.output, fn);
        } else {
            out = output.get(j.output, null);
        }

        let jobList;
        if (j.type == "enum") {
            jobList = new Array(j.request.length * j.enumerator.length);
        } else {
            jobList = new Array(j.request.length);
        }

		for (var i = 0; i < j.request.length; i++) {
            let reqId = getRequestId(j.request[i]);
        	let reqTmplt = requestTemplates[reqId];

            if (j.type == "static") {
                let jreq = getJobRequestConf(j.request[i], reqId);
                let req = getJobRequest(reqTmplt, jreq, null);
                if (req != null) {
                    let id = procid + "-" + (i+i);
                    saveJob({
                        _id: id,
                        req: req,
                        reqId: reqId,
                        selector: reqTmplt.selector,
                        enumStr: enumStr
                    });
                    jobList[i + 1] = id;
                }
            } else if (j.type == "enum") {
            	console.info("Job-Manager: Enumerating job requests...");
                for (let e = 0; e < j.enumerator.length; e++) {
                    let jreq = getJobRequestConf(j.request[i], reqId);
                    let enumStr = j.enumerator[e];
                    let req = getJobRequest(reqTmplt, jreq, enumStr);
                    if (req != null) {
                        let ii = i * j.request.length + e;
                        let id = procid + "-" + (ii+1);
                        saveJob({
                            _id: id,
                            req: req,
                            reqId: reqId,
                            selector: reqTmplt.selector,
                            enumStr: enumStr
                        });
                        jobList[ii] = id;
	                }
                }
            }
        }

        let jo = queue.create(procid, jobList);
        jo.priority(j.priority);
        jo.removeOnComplete(true);
        jo.on('complete', function () {
            console.info("Job-Manager: Job #" + jo.id + " completed");
        } ).on('failed', function () {
            console.error("Job-Manager: Job #" + jo.id + " failed");
        } ).on('progress', function (progress) {
            process.stdout.write('Job-Manager: job #' + jo.id + ' ' + progress + '% complete\n');
        });
        jo.save((err) => {
            if (err) { console.error(err);}
            else { console.info("Job-Manager: Job %d enqueued.", jo.id); }
        });

        queue.process(procid, j.thread, function(job, done) {
            let jnum = job.data.length;
            console.log("Job-Manager: Processing job %d...", job.id);

            function next(i) {
                setTimeout(function() {
                    getJobRun(job.data[i], function(data, err) {
                        if (err) {
                            console.error("Job-Manager: " + error);
                            console.log("Job-Manager: Skip request " +
                                data._id);
                        }

                        runRequest(data, function(body, error) {
                            if (!error) {
                                if (j.cache != null) {
                                    let n = "/" + data.id + "-" + data.reqId;
                                    if (data.enumStr != null) {
                                        n += "-" + data.enumStr;
                                    }
                                    cache.store(p + n, body);
                                }
                                out.write({
                                    request: data.reqId,
                                    enumerator: data.enumStr,
                                    result: body
                                });
                            } else {
                                console.error("Job-Manager: " + error);
                                console.log("Job-Manager: Skip request " +
                                    data._id);
                            }

                            deleteJob(data._id);
                            job.progress(i + 1, jnum);  // Report progress
                            if (i + 1 == jnum) done();
                            else next(i + 1);
                        });
                    });
                }, j.delay);
            }

            next(0);
        });
	}
}