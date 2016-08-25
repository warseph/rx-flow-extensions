'use strict';

const Rx = require('rx');
const cached = require('../../extensions/cached');

describe('cached', () => {
  const withTestData = fn => {
    const onNext = sinon.spy();
    const operation = sinon.spy(v => v + 1);
    const observable = cached.static(Rx.Observable.just(0).map(operation), 100);
    return fn(observable, operation, onNext);
  };

  it('should cache elements for a second call`',
    done => withTestData((observable, operation, onNext) => {
      observable.subscribe(onNext);
      observable.subscribe(onNext, fail, () => {
        expect(onNext).to.have.calledTwice;
        expect(operation).to.have.been.calledOnce;
        done();
      });
    })
  );

  it('should cache elements for the specified time', done =>
    fakeTime((finish, clock) => withTestData((observable, operation, onNext) => {
      setTimeout(() => observable.subscribe(onNext, fail, () => {
        expect(onNext).to.have.calledThrice;
        expect(operation).to.have.been.calledTwice;
        finish();
        done();
      }), 200);
      observable.subscribe(onNext);
      observable.subscribe(onNext, fail, () => clock.tick(200));
    })
  ));

  it('should recache elements after invalidating', done =>
    fakeTime((finish, clock) => withTestData((observable, operation, onNext) => {
      setTimeout(() => observable.subscribe(onNext), 150);
      setTimeout(() => observable.subscribe(onNext, fail, () => {
        expect(onNext).to.have.calledThrice;
        expect(operation).to.have.been.calledTwice;
        finish();
        done();
      }), 200);
      observable.subscribe(onNext, fail, () => clock.tick(200));
    }))
  );
});
