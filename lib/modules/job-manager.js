const config = require('./config');
const command = require('./command');
const object = require('./object');
const strMathcer = require('./str-matcher');
const selector = require('./selector');
// const database = require('./database');
const output = require('./output');
const request = require('request');
const fs = require('fs');
const path = require('path');
const kue = require('kue');
const queue = kue.createQueue();

/* Job queue configurations */
// run watchdog to fix unstable redis connection
queue.watchStuckJobs();

/* Global variable declarations */
const ignoredReqOptions = ["selector", "id", "fillable", "pagination"];

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
 * Enqueue a job request to a process
 * @param  {string}  procid   Process identifier
 * @param  {object}  data     Data of job to be processed
 * @param  {integer} delay    Job delay in millisecond
 * @param  {string}  priority Job priority
 */
function enqueueJobReq(procid, data, delay, priority) {
	let job = queue.create(
		procid, data
	)
	.delay(delay)
	.priority(priority)
    .removeOnComplete(true)
	.save(
		(err) => {
			if (err) throw err;
			console.log("Job %d saved to the queue.", job.id);
		}
	);
}

/**
 * [processRequest description]
 * @param  {[type]} jdata  [description]
 * @param  {[type]} done [description]
 * @return {[type]}      [description]
 */
function processJobRequest(jdata, done) {
	request(
        jdata.req,
        function (error, response, body) {
            if (jdata.hasOwnProperty('selector')) {
                body = selector.run(
                    response,
                    body,
                    jdata.selector
                );
            }
            if (!error) {
                output.save({
                    request: jdata.reqId,
                    enumerator: jdata.enumStr,
                    result: body
                });
                done();
            } else {
            	return done(new Error(error));
            }
        }
    )
}

/* Module export */
module.exports = {
	parseJob: function(job, id) {
		if (!job.hasOwnProperty('type')) {
            job.type = "static";
        }

        if (job.type == "enum") {
            if (job.enumerator.type == "file") {
                job.enumerator = getEnumeratorFile(
                    job.enumerator.path);
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

        if (!job.output.hasOwnProperty('buffer_size')) {
            if (job.type != "stdout") {
                job.output.buffer_size = job.request.length;
                if (job.type == "enum") {
                    job.output.buffer_size *= job.enumerator.length;
                }
            } else {
                job.output.buffer_size = 1;
            }
        }

        if (!job.output.hasOwnProperty("format")) {
            job.output.format = null;
        }
    },
    prepareJobProcess: function(id, jcnf) {
    	queue.process(id, jcnf.thread, function(job, done){
		  	processJobRequest(job.data, done);
		});
    },
	enqueueAllJobReq: function(procid, job, requestTemplates) {
		console.log("Enqueue all request jobs.");

        if (job.output.type != "stdout") {
            let fn = path.join(__dirname, '..', '..', 'output', job.output.name);
            output.init(job.output, fn);
        } else {
            output.init(job.output, null);
        }

		for (var i = 0; i < job.request.length; i++) {
            let reqId = getRequestId(job.request[i]);
        	let reqTmplt = requestTemplates[reqId];

            if (job.type == "static") {
                let jreq = getJobRequestConf(job.request[i], reqId);
                let req = getJobRequest(reqTmplt, jreq, null);
                if (req != null) {
                	enqueueJobReq(
                		procid,
                		{
                            req: req,
                            reqId: reqId,
                			selector: reqTmplt.selector,
                            enumStr: null
                		},
                		job.delay,
                		job.priority
                	);
                }
            } else if (job.type == "enum") {
            	console.log("Enumerating all job request.");
                for (let e = 0; e < job.enumerator.length; e++) {
                    let jreq = getJobRequestConf(job.request[i], reqId);
                    let enumStr = job.enumerator[e];
                    let req = getJobRequest(reqTmplt, jreq, enumStr);
                    if (req != null) {
	                	enqueueJobReq(
	                		procid,
	                		{
                                req: req,
                                reqId: reqId,
	                			selector: reqTmplt.selector,
                                enumStr: enumStr
	                		},
	                		job.delay,
	                		job.priority
	                	);
	                }
                }
            }
        }
	}
}