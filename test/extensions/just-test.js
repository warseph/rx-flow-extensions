'use strict';

const Rx = require('rx');
const just = require('../../extensions/just');

describe('just', () => {
  it('should change the current value to the specified one', done => {
    const obs = Rx.Observable.just('something');
    just.extend(obs);
    obs.just('test').forEach(
      val => {
        expect(val).to.eq('test');
      },
      e => expect.fail(null, null, e.message),
      done
    );
  });
});
