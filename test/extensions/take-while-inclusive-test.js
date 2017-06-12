'use strict';

const Rx = require('rxjs/Rx');
const takeWhileInclusive = require('../../extensions/take-while-inclusive');

describe('takeWhileInclusive', () => {
  it('should take elements until one after the condition is true', done => {
    const obs = Rx.Observable.range(0, 5);
    takeWhileInclusive.extend(obs);
    const tester = sinon.spy();
    obs.takeWhileInclusive(v => v < 2).subscribe(
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

  it('should take elements until the specified amount after the condition is true', done => {
    const obs = Rx.Observable.range(0, 5);
    takeWhileInclusive.extend(obs);
    const tester = sinon.spy();
    obs.takeWhileInclusive(v => v < 2, 3).subscribe(
      tester,
      e => expect.fail(null, null, e.message),
      () => {
        expect(tester).to.have.callCount(5);
        expect(tester).to.have.been.calledWith(0);
        expect(tester).to.have.been.calledWith(1);
        expect(tester).to.have.been.calledWith(2);
        expect(tester).to.have.been.calledWith(3);
        expect(tester).to.have.been.calledWith(4);
        done();
      }
    );
  });
});
