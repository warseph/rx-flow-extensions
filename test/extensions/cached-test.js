'use strict';
/* eslint-env node, mocha */
/* global expect, sinon, fakeTime, fail */
/* eslint prefer-arrow-callback: 0 */
/* eslint no-unused-expressions: 0 */
const Rx = require('rx');
require('../helper');
const cached = require('../../extensions/cached');

describe('cached', function () {
  const withTestData = (fn) => {
    const onNext = sinon.spy();
    const operation = sinon.spy(v => v + 1);
    const observable = cached.static(Rx.Observable.just(0).map(operation), 100);
    return fn(observable, operation, onNext);
  };

  it('should cache elements for a second call`',
    (done) => withTestData((observable, operation, onNext) => {
      observable.subscribe(onNext);
      observable.subscribe(onNext, fail, () => {
        expect(onNext).to.have.calledTwice;
        expect(operation).to.have.been.calledOnce;
        done();
      });
    })
  );

  it('should cache elements for the specified time',
    fakeTime((clock, done) => withTestData((observable, operation, onNext) => {
      setTimeout(() => observable.subscribe(onNext, fail, () => {
        expect(onNext).to.have.calledThrice;
        expect(operation).to.have.been.calledTwice;
        done();
      }), 200);
      observable.subscribe(onNext);
      observable.subscribe(onNext, fail, () => clock.tick(200));
    })
  ));

  it('should recache elements after invalidating',
    fakeTime((clock, done) => withTestData((observable, operation, onNext) => {
      setTimeout(() => observable.subscribe(onNext), 150);
      setTimeout(() => observable.subscribe(onNext, fail, () => {
        expect(onNext).to.have.calledThrice;
        expect(operation).to.have.been.calledTwice;
        done();
      }), 200);
      observable.subscribe(onNext, fail, () => clock.tick(200));
    }))
  );
});
