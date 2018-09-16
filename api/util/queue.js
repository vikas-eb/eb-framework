var kue = require('kue');

let queue;

/**
 * BEWARE: You will need a running queue redis server to make this code work
 */

module.exports = {

    createQueue(jobName, jobObject) 
    {
        if(!queue) {
            queue = kue.createQueue({
                "prefix": "boilerplatequeue"
            });
        }

        queue.create(jobName, jobObject)
            .removeOnComplete(true)
            .save();
    }
}