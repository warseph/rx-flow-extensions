'use strict';
/* eslint-env node, mocha */
/* global expect, sinon */
/* eslint prefer-arrow-callback: 0 */
const Rx = require('rx');
require('../helper');
const polling = require('../../extensions/polling');

describe('polling', function () {
  it('should poll for elements until max attempts is reached', function (done) {
    const obs = Rx.Observable.range(0, 5);
    polling.extend(obs);
    const tester = sinon.spy();
    obs.polling(10, 3)
      .forEach(
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
