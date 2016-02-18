/**
 * Created by U6020429 on 08/01/2016.
 */
'use strict';
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const expect = chai.expect;

const Brick = require('../lib/');

let brick;
const DEFAULTS = {
};
before(function() {
  brick = new Brick({}, DEFAULTS);
});

describe('Module loading', function() {
  it('should return new Brick object', function(done) {
    expect(brick).to.be.an.instanceof(Brick);
    done();
  });
});

describe('Brick - validate job', function() {
  context('when missing/incorrect \'id\' string property in job', function() {
    it('should throw an error', function() {
      const job = {};
      const validatePromise = brick.validate(job);
      return expect(validatePromise).to.eventually.be.rejectedWith(Error, 'missing/incorrect \'id\' string property in job');
    });
  });

  context('when missing/incorrect \'nature\' object property in job', function() {
    it('should throw an error', function() {
      const job = {
        id: '001',
      };
      const validatePromise = brick.validate(job);
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
      const validatePromise = brick.validate(job);
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
      const validatePromise = brick.validate(job);
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
      const validatePromise = brick.validate(job);
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
      const validatePromise = brick.validate(job);
      expect(validatePromise).to.eventually.be.an('object')
        .and.to.have.property('ok', 1);
      done();
    });
  });
});

describe('Brick - do job', function() {
  it('should fulfill promise', function() {
    const job = {
      id: '001',
      nature: {
        quality: 'Execution',
        type: 'CommandLine',
      },
      payload: {},
    };
    return expect(brick.doJob(job)).to.be.fulfilled;
  });
});
