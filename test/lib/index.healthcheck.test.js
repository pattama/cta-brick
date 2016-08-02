'use strict';
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const assert = chai.assert;
const sinon = require('sinon');
require('sinon-as-promised');
const _ = require('lodash');

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

describe('Brick - healthCheck', function() {
  context('when healthCheck exists in cementHelper.dependencies', function() {
    const healthCheck = {
      update: () => {},
    };
    const cementHelper = _.cloneDeep(DEFAULTCEMENTHELPER);
    cementHelper.dependencies.healthCheck = healthCheck;
    let brick;
    let spy;
    before(function() {
      brick = new Brick(cementHelper, DEFAULTCONFIG);
      spy = sinon.spy(brick.dependencies.healthCheck, 'update');
      brick.health();
    });
    after(function() {
      spy.restore();
    });
    it('should have healthCheck dependency', function() {
      assert.property(brick.dependencies, 'healthCheck');
    });
    it('should update a healthCheck', function() {
      sinon.assert.called(spy);
    });
  });

  context('when healtCheck does not exist in cementHelper.dependencies', function() {
    let brick;
    before(function() {
      brick = new Brick(DEFAULTCEMENTHELPER, DEFAULTCONFIG);
      sinon.spy(brick.logger, 'error');
      brick.health();
    });
    after(function() {
      brick.logger.error.restore();
    });
    it('should log error', function() {
      sinon.assert.calledWith(brick.logger.error, 'Missing health dependency');
    });
  });
});
