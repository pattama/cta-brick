'use strict';
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const expect = chai.expect;
const sinon = require('sinon');
require('sinon-as-promised');

const Brick = require('../../lib/');
const logger = require('cta-logger');

const DEFAULTCONFIG = {
  name: 'brick',
  properties: {},
};
const DEFAULTLOGGER = logger();
const DEFAULTCEMENTHELPER = {
  constructor: {
    name: 'CementHelper',
  },
  brickName: 'brick',
  dependencies: {
    logger: DEFAULTLOGGER,
  },
};

describe('Brick - process context', function() {
  let brick;
  let context;
  before(function() {
    brick = new Brick(DEFAULTCEMENTHELPER, DEFAULTCONFIG);
    const job = {
      id: '001',
      nature: {
        quality: 'Execution',
        type: 'CommandLine',
      },
      payload: {},
    };
    context = {
      data: job,
      emit: function(event, brickName, response) {
        console.log('mock emit', event, brickName, response);
      },
    };
    sinon.spy(brick.logger, 'info');
    sinon.spy(context, 'emit');
    brick.process(context);
  });

  it('should log info message', function() {
    return expect(brick.logger.info.calledWith('job', context.data)).to.be.equal(true);
  });

  it('should emit done event on context', function() {
    return expect(context.emit.calledWith('done', brick.name, 'ok')).to.be.equal(true);
  });

  it('should return context', function() {
    return expect(brick.process(context)).to.be.equal(context);
  });
});
