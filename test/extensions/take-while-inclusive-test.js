'use strict';
/* eslint-env node, mocha */
/* global expect, sinon */
/* eslint prefer-arrow-callback: 0 */
const Rx = require('rx');
require('../helper');
const takeWhileInclusive = require('../../extensions/take-while-inclusive');

describe('takeWhileInclusive', function () {
  it('should take elements until one after the condition is true', function (done) {
    const obs = Rx.Observable.range(0, 5);
    takeWhileInclusive.extend(obs);
    const tester = sinon.spy();
    obs.takeWhileInclusive(v => v < 2).forEach(
      tester,
      e => expect.fail(null, null, e.message),
      () => {
        expect(tester).to.have.callCount(3);
        expect(tester).to.have.been.calledWith(0);
        expect(tester).to.have.been.calledWith(1);
        expect(tester).to.have.been.calledWith(2);
        done();
      }
    );
  });
});
