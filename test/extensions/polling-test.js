'use strict';

const Rx = require('rx');
const polling = require('../../extensions/polling');

describe('polling', () => {
  it('should poll for elements until max attempts is reached', done => {
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
