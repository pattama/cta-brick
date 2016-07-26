'use strict';

class Brick {
  /**
   * Create a new Brick instance
   * @param {CementHelper} cementHelper - cementHelper instance
   * @param {BrickConfig} config - cement configuration of the brick
   */
  constructor(cementHelper, config) {
    this.cementHelper = cementHelper;

    if (!('name' in config) || typeof config.name !== 'string') {
      throw (new Error(`missing/incorrect 'name' string property in config`));
    }
    this.name = config.name;
    this.dependencies = (cementHelper !== null && typeof cementHelper === 'object' && 'dependencies' in cementHelper) ? cementHelper.dependencies : {};

    // Ensure we have logger dependency
    // TODO throw if not
    if (!this.dependencies.logger) {
      const Logger = require('cta-logger');
      this.logger = new Logger();
    } else {
      // TODO pass author property
      this.logger = this.dependencies.logger;
    }

    if ('properties' in config) {
      if (typeof config.properties !== 'object') {
        throw (new Error(`incorrect 'properties' object property in config`));
      }
    }
    this.properties = config.properties;
  }

  /**
   * This method is called by Cement before starting pub/sub between Bricks
   * It should be override only by child Bricks that need initialization before being plugged into the flow
   * ie. connect to MQ, Db, starting server...etc
   * for test case, you can simulate in your brick a random delay eg.
   * const delay = 1000 * Math.ceil(1 + 3 * Math.random());
   * return new Promise((resolve) => {
   *   setTimeout(() => {
   *     that.logger.info(`Initialized Brick ${that.name}.`);
   *     resolve('ok');
   *   }, delay);
   * });
   * */
  init() {
    const that = this;
    return new Promise((resolve) => {
      that.logger.info(`Initialized Brick ${that.name}.`);
      resolve('ok');
    });
  }

  /**
   * This method is called by Cement when all other Bricks are initialized and ready
   * It should be override only by child Bricks that directly publish data to the flow
   * without having to wait for other bricks to get data from (eg. Receiver)
   * It guarantees that Bricks interconnection are done by the Cement
   * */
  start() {
    this.logger.info(`Starting Brick ${this.name}...`);
  }

  /**
   * Validates Context properties
   * @param {Context} context - a Context
   * @returns {Promise}
   */
  validate(context) {
    const job = context.data;
    return new Promise((resolve, reject) => {
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
   * Process the context
   * @param {Context} context - a Context
   */
  process(context) {
    this.logger.info('job', context.data);
    context.emit('done', this.name, 'ok');
    return context;
  }

  /**
   * Push brick health
   * @sample
   * a backup brick can push:
   * {status: 'yellow', reason: 'disc space usage reached 80%', services: []}
   * a complex brick can push:
   * {
   *  status: 'red',
   *  reason: 'service one is down!',
   *  services: [{
   *    name: 'one',
   *    status: 'red',
   *    reason: 'service is down!'
   *  }, {
   *    name: 'two',
   *    status: 'green',
   *    reason: 'service is up'
   *  }]
   * }
   */
  health(status) {
    if (this.healthCheck) {
      this.healthCheck.update(this.name, status);
    }
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
