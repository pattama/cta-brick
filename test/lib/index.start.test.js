'use strict';
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const assert = chai.assert;

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

describe('Brick - start', function() {
  it('should have start method', function() {
    const b = new Brick(DEFAULTCEMENTHELPER, DEFAULTCONFIG);
    try {
      b.start();
    } catch (e) {
      assert.fail(e, null, 'should not throw an error on start method');
    }
  });
});
