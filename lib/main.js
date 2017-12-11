/* Modules declarations */
const jobManager = require('./modules/job-manager');

module.exports = {
    scrape:function(jobs, requestTemplates) {
        for (j in jobs) {
            jobManager.parseJob(jobs[j], j);

            if (jobs[j].status == 1) {
                jobManager.run(j, jobs[j], requestTemplates);
            }
        }
    }
};