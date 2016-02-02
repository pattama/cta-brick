/**
 * Created by U6020429 on 29/01/2016.
 */
'use strict';

class Brick {
  /**
   * Create a new Brick instance
   * @param {Object} options - options to configure Brick
   */
  constructor(options) {
    // configure tools like security, logging, ...
  }

  /**
   * Process the job
   * @param {Job} job - input job
   * @param {Function} [callback] - called after job completion
   * @returns {Promise} - returned after job acknowledgment
   */
  doJob(job, callback) {
    // do pre operations (security ?)
    // next operations are implemented by Child classes
    return new Promise((resolve, reject) => {
      resolve({ ok: 1 });
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
