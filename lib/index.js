/**
 * Created by U6020429 on 29/01/2016.
 */
'use strict';
const co = require('co');
const events = require('events');
const EventEmitter = events.EventEmitter;
const defaultLogger = require('cta-logger');

class Brick extends EventEmitter {
  /**
   * Create a new Brick instance
   * @param {CementHelper} cementHelper - cementHelper instance
   * @param {BrickConfig} config - cement configuration of the brick
   */
  constructor(cementHelper, config) {
    super();

    this.cementHelper = cementHelper;

    if (!('name' in config) || typeof config.name !== 'string') {
      throw (new Error(`missing/incorrect 'name' string property in config`));
    }
    this.name = config.name;
    this.logger = typeof cementHelper === 'object' && 'logger' in cementHelper ? cementHelper.logger : defaultLogger();

    if ('properties' in config) {
      if (typeof config.properties !== 'object') {
        throw (new Error(`incorrect 'properties' object property in config`));
      }
    }
    this.properties = config.properties;
  }

  /**
   * This method should not be override by child bricks
   * It emits "initialized" event to the Cement to tell him i'm ready to be plugged into the flow
   * Important: we add a delay of 100ms for the Cement to first instanciate the Brick before listening to its event
   * eg. if you emit the event in the brick constructor, the cement won't see it
   * */
  _initialized() {
    const that = this;
    setTimeout(function() {
      that.emit('initialized');
    }, 100);
  }

  /**
   * This method is called by Cement before starting pub/sub between Bricks
   * It should be override only by child Bricks that need initialization before being plugged into the flow
   * ie. connect to MQ, Db, starting server...etc
   * Important: you should call this._initialized() when your brick is really ready
   * for test case, you can simulate in your brick a random delay eg.
   * const delay = 1000 * Math.ceil(1 + 3 * Math.random());
   * const that = this;
   * setTimeout(function() {
   *   that._initialized();
   * }, delay);
   * */
  init() {
    this._initialized();
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
