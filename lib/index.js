'use strict';

class Brick {
  /**
   * Create a new Brick instance
   * @param {CementHelper} cementHelper - cementHelper instance
   * @param {BrickConfig} configuration - cement configuration of the brick
   */
  constructor(cementHelper, configuration) {
    if (cementHelper === null || typeof cementHelper !== 'object') {
      throw (new Error(`missing/incorrect 'cementHelper' CementHelper argument`));
    }
    this.cementHelper = cementHelper;

    if (configuration === null || typeof configuration !== 'object') {
      throw (new Error(`missing/incorrect 'config' object argument`));
    }
    this.configuration = configuration;

    if (!configuration.hasOwnProperty('name') || typeof configuration.name !== 'string') {
      throw (new Error(`missing/incorrect 'name' string property in config`));
    }
    this.name = configuration.name;

    this.dependencies = (cementHelper.hasOwnProperty('dependencies')) ? cementHelper.dependencies : {};
    if (!this.dependencies.logger) {
      const Logger = require('cta-logger');
      this.logger = new Logger();
    }
    this.logger = this.dependencies.logger.author(this.name);

    if (configuration.hasOwnProperty('properties')) {
      if (typeof configuration.properties !== 'object') {
        throw (new Error(`incorrect 'properties' object property in config`));
      }
    }
    this.properties = configuration.properties;
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
      if (!job.hasOwnProperty('nature') || typeof job.nature !== 'object') {
        reject(new Error('missing/incorrect \'nature\' object property in job'));
      }

      if (!job.nature.hasOwnProperty('quality') || typeof job.nature.quality !== 'string') {
        reject(new Error('missing/incorrect \'quality\' string property in job nature'));
      }

      if (!job.nature.hasOwnProperty('type') || typeof job.nature.type !== 'string') {
        reject(new Error('missing/incorrect \'type\' string property in job nature'));
      }

      if (!job.hasOwnProperty('payload') || typeof job.payload !== 'object') {
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
   * @param {object} data
   * @param {string} data.status - green, yellow, red
   * - green: brick can be used properly
   * - yellow: brick has reached a critic point, but it still can be used properly
   * - red: brick can't be used properly
   * @param {string=} data.reason - describe why green, why yellow, why red
   * @param {string=} data.serviceName - optional, to identify the related internal service
   * - in case of a brick pushes multiple services, its status will be the aggregation of all services statuses
   * @sample
   * A backup brick that uses disc space can push statuses like:
   * {status: 'yellow', reason: 'disc space usage reached 80%'}
   * {status: 'green', reason: 'disc space usage below 80%'}
   *
   * A complex brick that uses two internal services can push statuses like:
   * {status: 'red', reason: 'you do not have permissions to write on file /tmp/foo/bar', serviceName: 'one'}
   * {status: 'green', reason: 'ok', serviceName: 'one'}
   * {status: 'yellow', reason: 'critic point reached', serviceName: 'two'}
   * {status: 'green', reason: 'ok', serviceName: 'two'}
   */
  health(data) {
    if (this.dependencies.healthCheck) {
      this.dependencies.healthCheck.update(this.name, data);
    } else {
      this.logger.error('Missing health dependency');
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
