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
  brick = new Brick(DEFAULTS);
});

describe('Module loading', function() {
  it('should return new Brick object', function(done) {
    expect(brick).to.be.an.instanceof(Brick);
    done();
  });
});

describe('Brick - do job', function() {
  it('should fulfill promise', function() {
    return expect(brick.doJob()).to.be.fulfilled;
  });
});
