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

describe('Brick - init', function() {
  it('should have "init" method', function(done) {
    const b = new Brick(DEFAULTCEMENTHELPER, DEFAULTCONFIG);
    b.init()
      .then(() => {
        done();
      })
      .catch((e) => {
        assert.fail(e, null, 'should not throw an error on init method');
        done();
      });
  });
});
