/**
 * Created by U6020429 on 29/01/2016.
 */
'use strict';

class Brick {
  /**
   * Create a new Brick instance
   */
  constructor() {
  }

  /**
   * Process the job
   * @param {Job} job - input job
   * @param {Function} [callback] - optional callback at termination of job
   * @returns {Promise}
   */
  doJob(job, callback) {
    return new Promise((resolve, reject) => {
      resolve();
    });
  }
}

/**
 * @typedef {Object} Job
 * @property {String} id - id of the job
 * @property {Object} nature - nature description of the job
 * @property {String} nature.quality - quality of the job
 * @property {String} nature.type - type of the job
 * @property {Object} payload - payload of the job
 */
exports = module.exports = Brick;
