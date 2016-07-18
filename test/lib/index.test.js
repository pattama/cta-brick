'use strict';
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const expect = chai.expect;
const assert = chai.assert;
const sinon = require('sinon');
require('sinon-as-promised');

const Brick = require('../../lib/');

let brick;
const DEFAULTS = {
  name: 'brick',
  properties: {},
};
before(function() {
  brick = new Brick({}, DEFAULTS);
});

describe('Module loading', function() {
  context('when missing/incorrect name string property in config', function() {
    it('should throw an error', function() {
      return expect(function() {
        return new Brick({}, {
          name: {},
        });
      }).to.throw(Error, `missing/incorrect 'name' string property in config`);
    });
  });

  context('when missing/incorrect properties object property in config', function() {
    it('should throw an error', function() {
      return expect(function() {
        return new Brick({}, {
          name: 'brick',
          properties: '',
        });
      }).to.throw(Error, `incorrect 'properties' object property in config`);
    });
  });

  context('when valid', function() {
    it('should return new Brick object', function(done) {
      expect(brick).to.be.an.instanceof(Brick);
      done();
    });
  });
});

describe('Brick - init', function() {
  it('should have "init" method', function(done) {
    const b = new Brick({}, DEFAULTS);
    Promise.all([b.init()])
    .then(() => {
      done();
    })
    .catch((e) => {
      assert.fail(e, null, 'should not throw an error on init method');
      done();
    });
  });
});

describe('Brick - start', function() {
  it('should have start method', function() {
    const b = new Brick({}, DEFAULTS);
    try {
      b.start();
    } catch (e) {
      assert.fail(e, null, 'should not throw an error on start method');
    }
  });
});

describe('Brick - validate job', function() {
  context('when missing/incorrect \'nature\' object property in job', function() {
    it('should throw an error', function() {
      const job = {
        id: '001',
      };
      const context = { data: job };
      const validatePromise = brick.validate(context);
      return expect(validatePromise).to.eventually.be.rejectedWith(Error, 'missing/incorrect \'nature\' object property in job');
    });
  });

  context('when missing/incorrect \'quality\' string property in job nature', function() {
    it('should throw an error', function() {
      const job = {
        id: '001',
        nature: {
          type: 'bar',
        },
      };
      const context = { data: job };
      const validatePromise = brick.validate(context);
      return expect(validatePromise).to.eventually.be.rejectedWith(Error, 'missing/incorrect \'quality\' string property in job nature');
    });
  });

  context('when missing/incorrect \'type\' string property in job nature', function() {
    it('should throw an error', function() {
      const job = {
        id: '001',
        nature: {
          quality: 'Execution',
        },
      };
      const context = { data: job };
      const validatePromise = brick.validate(context);
      return expect(validatePromise).to.eventually.be.rejectedWith(Error, 'missing/incorrect \'type\' string property in job nature');
    });
  });

  context('when missing/incorrect \'payload\' object property in job', function() {
    it('should throw an error', function() {
      const job = {
        id: '001',
        nature: {
          quality: 'Execution',
          type: 'CommandLine',
        },
      };
      const context = { data: job };
      const validatePromise = brick.validate(context);
      return expect(validatePromise).to.eventually.be.rejectedWith(Error, 'missing/incorrect \'payload\' object property in job');
    });
  });

  context('when job is valid', function() {
    it('should throw an error', function(done) {
      const job = {
        id: '001',
        nature: {
          quality: 'Execution',
          type: 'CommandLine',
        },
        payload: {},
      };
      const context = { data: job };
      const validatePromise = brick.validate(context);
      expect(validatePromise).to.eventually.be.an('object')
        .and.to.have.property('ok', 1);
      done();
    });
  });
});

describe('Brick - process context', function() {
  let context;
  before(function() {
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
      send: function(event, brickName, response) {
        console.log('mock emit', event, brickName, response);
      },
    };
    sinon.spy(brick.logger, 'info');
    sinon.spy(context, 'send');
    brick.process(context);
  });

  it('should log info message', function() {
    return expect(brick.logger.info.calledWith('job', context.data)).to.be.equal(true);
  });

  it('should emit done event on context', function() {
    return expect(context.send.calledWith('done', 'ok')).to.be.equal(true);
  });

  it('should return context', function() {
    return expect(brick.process(context)).to.be.equal(context);
  });
});
