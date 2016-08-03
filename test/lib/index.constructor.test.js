'use strict';
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const expect = chai.expect;
const sinon = require('sinon');
require('sinon-as-promised');
const requireSubvert = require('require-subvert')(__dirname);
const _ = require('lodash');

const Brick = require('../../lib/');
const Logger = require('cta-logger');

const DEFAULTCONFIG = {
  name: 'brick',
  properties: {},
};
const DEFAULTLOGGER = new Logger();
const DEFAULTCEMENTHELPER = {
  constructor: {
    name: 'CementHelper',
  },
  brickName: 'brick',
  dependencies: {
    logger: DEFAULTLOGGER,
  },
};

describe('Brick - constructor', function() {
  context(`when missing 'cementHelper' argument`, function() {
    it('should throw an Error', function() {
      return expect(function() {
        return new Brick(null, DEFAULTCONFIG);
      }).to.throw(Error, `missing/incorrect 'cementHelper' CementHelper argument`);
    });
  });

  context(`when incorrect 'cementHelper' argument`, function() {
    it('should throw an Error', function() {
      return expect(function() {
        return new Brick('not-a-cementhelper', DEFAULTCONFIG);
      }).to.throw(Error, `missing/incorrect 'cementHelper' CementHelper argument`);
    });
  });

  context(`when missing/incorrect 'config' argument`, function() {
    it('should throw an Error', function() {
      return expect(function() {
        return new Brick(DEFAULTCEMENTHELPER, null);
      }).to.throw(Error, `missing/incorrect 'config' object argument`);
    });
  });

  context('when missing/incorrect name string property in config', function() {
    const config = _.cloneDeep(DEFAULTCONFIG);
    config.name = {};
    it('should throw an error', function() {
      return expect(function() {
        return new Brick(DEFAULTCEMENTHELPER, config);
      }).to.throw(Error, `missing/incorrect 'name' string property in config`);
    });
  });

  context('when missing/incorrect properties object property in config', function() {
    const config = _.cloneDeep(DEFAULTCONFIG);
    config.properties = '';
    it('should throw an error', function() {
      return expect(function() {
        return new Brick(DEFAULTCEMENTHELPER, config);
      }).to.throw(Error, `incorrect 'properties' object property in config`);
    });
  });

  context('when valid', function() {
    context('when logger exists in cementHelper.dependencies', function() {
      let brick;
      before(function() {
        sinon.spy(DEFAULTLOGGER, 'author');
        brick = new Brick(DEFAULTCEMENTHELPER, DEFAULTCONFIG);
      });
      after(function() {
        DEFAULTLOGGER.author.restore();
      });
      it('should return new Brick object', function(done) {
        expect(brick).to.be.an.instanceof(Brick);
        expect(brick).to.have.property('cementHelper', DEFAULTCEMENTHELPER);
        expect(brick).to.have.property('configuration', DEFAULTCONFIG);
        expect(brick).to.have.property('name', DEFAULTCONFIG.name);
        expect(brick).to.have.property('dependencies', DEFAULTCEMENTHELPER.dependencies);
        expect(brick).to.have.property('properties', DEFAULTCONFIG.properties);
        done();
      });

      it('should call logger author method and set the result as Brick.logger property', function() {
        sinon.assert.called(DEFAULTLOGGER.author);
        expect(brick).to.have.property('logger');
        expect(brick.logger).to.equal(DEFAULTLOGGER.author.returnValues[0]);
      });
    });

    context('when logger doesn\'t exist in cementHelper.dependencies', function() {
      let brick;
      let cementHelper;
      let stubLogger;
      before(function() {
        stubLogger = sinon.stub().returns(DEFAULTLOGGER);
        requireSubvert.subvert('cta-logger', stubLogger);

        cementHelper = _.cloneDeep(DEFAULTCEMENTHELPER);
        delete cementHelper.dependencies.logger;
        brick = new Brick(cementHelper, DEFAULTCONFIG);
      });
      after(function() {
        requireSubvert.cleanUp();
      });
      it('should return new Brick object', function(done) {
        expect(brick).to.be.an.instanceof(Brick);
        expect(brick).to.have.property('cementHelper', cementHelper);
        expect(brick).to.have.property('configuration', DEFAULTCONFIG);
        expect(brick).to.have.property('name', DEFAULTCONFIG.name);
        expect(brick).to.have.property('dependencies', cementHelper.dependencies);
        expect(brick).to.have.property('properties', DEFAULTCONFIG.properties);
        done();
      });

      it('should create a new Logger and set it as Brick.logger property', function() {
        sinon.assert.called(stubLogger);
        expect(brick).to.have.property('logger', stubLogger.returnValues[0]);
      });
    });
  });
});
