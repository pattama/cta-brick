/**
 * Created by U6020429 on 29/01/2016.
 */
'use strict';
const co = require('co');

class Brick {
  /**
   * Create a new Brick instance
   * @param {CementHelper} cementHelper - cementHelper instance
   * @param {BrickConfig} config - cement configuration of the brick
   */
  constructor(cementHelper, config) {
    // configure tools like security, logging, ...
    this.cementHelper = cementHelper;

    if (!('name' in config) || typeof config.name !== 'string') {
      throw (new Error(`missing/incorrect 'name' string property in config`));
    }
    this.name = config.name;

    if ('properties' in config) {
      if (typeof config.properties !== 'object') {
        throw (new Error(`incorrect 'properties' object property in config`));
      }
    }
    this.properties = config.properties;
  }

  /**
   * Validates Job properties
   * @param {Job} job - input job
   * @returns {Promise}
   */
  validate(job) {
    return new Promise((resolve, reject) => {
      //if (!('id' in job) || typeof job.id !== 'string') {
      //  reject(new Error('missing/incorrect \'id\' string property in job'));
      //}

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
    return co(function* doJobCoroutine() {
      return job;
    });
  }

  onData(context) {
    const self = this;
    return co(function* onDataCoroutine() {
      yield self.validate(context.data);
      context.emit('accept', self.name);
      const res = yield self.doJob(context.data);
      context.emit('done', self.name, res);
      self.cementHelper.createContext(res)
        .on('accept', function onContextAccept(who) {
          console.log(`${self.name}: ${who} accepted`);
        })
        .on('reject', function onContextReject(who, reject) {
          console.log(`${self.name}: ${who} rejected with ${reject}`);
          context.emit('reject', who, reject);
        })
        .on('done', function onContextDone(who, result) {
          console.log(`${self.name}: ${who} done with ${JSON.stringify(result)}`);
        })
        .on('error', function onContextError(who, error) {
          console.log(`${self.name}: ${who} failed with ${error}`);
          context.emit('error', who, error);
        })
        .publish();
    }).catch((err) => {
      context.emit('reject', self.name, err);
      context.emit('error', self.name, err);
    });
  }
}

/**
 * @typedef {Object} BrickConfig
 * @property {String} name - name of the brick instance (should be unique)
 * @property {String} module - path or name of the brick module
 * @property {Object} [properties] - properties to instantiate the brick (see the module definition)
 * @property {LinkConfig[]} [links] - Array of LinkConfig
 */

/**
 * @typedef {Object} Job
 * @property {String} id - id of the job
 * @property {Object} nature - nature description of the job
 * @property {String} nature.quality - quality of the job
 * @property {String} nature.type - type of the job
 * @property {Object} payload - payload of the job
 */
exports = module.exports = Brick;
