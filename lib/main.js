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
    }
};