const config = require('./config');
const command = require('./command');
const objectModifier = require('./object-modifier');
const strMathcer = require('./str-matcher');
const selector = require('./selector');
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
 * Parse fill of request
 * @param  {object} fargs 		Object of fillable
 * @param  {String} currEnum  	Current enumerator
 */
function parseRequestFill(fargs, currEnum) {
    for (f in fargs) {
        if (typeof fargs[f] == "string") {
            if (fargs[f][0] == '>') {
                if (strMathcer.offsetMatch(fargs[f], "this.", 1)) {
                	if (currEnum != null) {
                		if (strMathcer.offsetMatch(fargs[f], "enumerator", 6)
                		) {
	                    	fargs[f] = currEnum;
	                    }
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
            objectModifier.modifyByArray(req, f, farg[freq[i]]);
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
 * @param  {Object} jreq  				Job request object
 * @param  {Object} req    				Object of request template
 * @param  {String} currEnum    		Current enumerator
 * @return {Object}       				Configured request job
 */
function getJobRequest(jreq, req, currEnum) {
    if (isRequestValid(req)) {
        if (req.hasOwnProperty('fillable')) {
            let fill = jreq.fill;

            parseRequestFill(fill, currEnum);

            if (jreq.hasOwnProperty('fill')) {
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
                if (jdata.output != "stdout") {
                    let fn = path.join(__dirname, '..', '..', 'output',
                        jdata.output.name);
                    if (jdata.output.hasOwnProperty('format')) {
                        output.write(
                        	body,
                        	jdata.output.type,
                        	fn,
                            jdata.output.format);
                    } else {
                        output.write(body, jdata.output.type, fn);
                    }
                } else {
                    console.log(body);
                }
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
            job.output = "stdout";
        }

        if (!job.output.hasOwnProperty('name')) {
        	job.output.name = id;
        }
    },
    prepareJobProcess: function(id, jcnf) {
    	queue.process(id, jcnf.thread, function(job, done){
		  	processJobRequest(job.data, done);
		});
    },
	enqueueAllJobReq: function(procid, job, requestTemplates) {
		console.log("Enqueue all request jobs.");

		for (r in job.request) {
        	let reqTmplt = requestTemplates[r];

            if (job.type == "static") {
                let req = getJobRequest(
                    job.request[r],
                    reqTmplt,
                    null);
                if (req != null) {
                	enqueueJobReq(
                		procid,
                		{
                			req: req,
                			selector: reqTmplt.selector,
                			output: job.output
                		},
                		job.delay,
                		job.priority
                	);
                }
            } else if (job.type == "enum") {
            	console.log("Enumerating all job request.");
                for (let e = 0; e < job.enumerator.length; e++) {
                    let req = getJobRequest(
                        job.request[r],
                        reqTmplt,
                        job.enumerator[e]);
                    if (req != null) {
	                	enqueueJobReq(
	                		procid,
	                		{
	                			req: req,
	                			selector: reqTmplt.selector,
	                			output: job.output
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