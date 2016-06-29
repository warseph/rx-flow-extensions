'use strict';

const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
chai.use(sinonChai);

global.expect = chai.expect;
global.sinon = sinon;

global.fakeTime = fn => done => {
  const clock = sinon.useFakeTimers();
  fn(clock, arg => { clock.restore(); done(arg); });
};

global.fail = (e) => global.expect.fail(null, null, e.message);
