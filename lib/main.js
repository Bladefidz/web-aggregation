/* Modules declarations */
const jobManager = require('./modules/job-manager');

module.exports = {
    scrape:function(jobs, requestTemplates) {
        for (j in jobs) {
            jobManager.parseJob(jobs[j], j);

            if (jobs[j].status == 1) {
                jobManager.prepareJobProcess(j, jobs[j]);
                console.log("Job %s prepared", j);
                jobManager.enqueueAllJobReq(j, jobs[j], requestTemplates);
            }
        }

        // let job = config.getAllJobs(jobConf, requests);

        // for (let i = 0; i < job.list.length; i++) {
        //     if (job.list[i] == 1) {
                // request(
                //     job.list[i],
                //     function (error, response, body) {
                //         if (jobConf.hasOwnProperty('selector')) {
                //             body = selector.run(
                //                 response,
                //                 body,
                //                 jobConf.selector
                //             );
                //         }

                //         if (!error) {
                //             if (job.list[i].hasOwnProperty('output')) {
                //                 let out = job.list[i].output;
                //                 let fn = path.join(__dirname, '..', 'output',
                //                     out.name);
                //                 if (job.list[i].hasOwnProperty('format')) {
                //                     output.write(body, out.type, fn,
                //                         out.format);
                //                 } else {
                //                     output.write(body, out.type, fn);
                //                 }
                //             } else {
                //                 console.log(body);
                //             }
                //         } else {
                //             console.log(error);
                //         }
                //     }
        //         );
        //     }
        // }
    }
};