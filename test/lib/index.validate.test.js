'use strict';
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const expect = chai.expect;

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

describe('Brick - validate job', function() {
  let brick;
  before(function() {
    brick = new Brick(DEFAULTCEMENTHELPER, DEFAULTCONFIG);
  });

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
