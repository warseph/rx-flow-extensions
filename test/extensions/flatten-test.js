'use strict';

const Rx = require('rx');
const flatten = require('../../extensions/flatten');

describe('flatten', () => {
  it('should flatten an observable of observables', done => {
    const obs = Rx.Observable.from([
      Rx.Observable.from([1, 2, 3]),
      Rx.Observable.from([4, 5, 6])
    ]);
    const expected = [1, 2, 3, 4, 5, 6];
    flatten.extend(obs);
    const tester = sinon.spy(arr => expect(arr).to.deep.eq(expected));

    obs
      .flatten()
      .toArray()
      .map(arr => arr.sort())
      .doOnNext(tester)
      .doOnError(fail)
      .doOnCompleted(() => {
        expect(tester).to.have.been.calledOnce;
        done();
      })
      .subscribe();
  });
});
