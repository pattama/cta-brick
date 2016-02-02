/**
 * Created by U6020429 on 29/01/2016.
 */
'use strict';
const co = require('co');

class Brick {
  /**
   * Create a new Brick instance
   * @param {Object} options - options to configure Brick
   */
  constructor(options) {
    // configure tools like security, logging, ...
  }

  /**
   * Validates Job properties
   * @param {Job} job - input job
   * @returns {Promise}
   */
  validate(job) {
    return new Promise((resolve, reject) => {
      if (!('id' in job) || typeof job.id !== 'string') {
        reject(new Error('missing/incorrect \'id\' string property in job'));
      }

      if (!('nature' in job) || typeof job.nature !== 'object') {
        reject(new Error('missing/incorrect \'nature\' object property in job'));
      }

      if (!('quality'in job.nature) || typeof job.nature.quality !== 'string') {
        reject(new Error('missing/incorrect \'quality\' string property in job nature'));
      }

      if (!('type'in job.nature) || typeof job.nature.type !== 'string') {
        reject(new Error('missing/incorrect \'type\' string property in job nature'));
      }

      if (!('payload' in job) || typeof job.payload !== 'object') {
        reject(new Error('missing/incorrect \'payload\' object property in job'));
      }

      resolve({ok: 1});
    });
  }

  /**
   * Process the job
   * @param {Job} job - input job
   * @param {Function} [callback] - called after job completion
   * @returns {Promise} - returned after job acknowledgment
   */
  doJob(job, callback) {
    const self = this;
    return co(function* doJobCoroutine() {
      yield self.validate(job);
      // do some other pre operations (security?) ...
      return {ok: 1};
      // next operations are implemented by Child class (extended)
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
