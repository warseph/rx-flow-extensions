'use strict';

const Rx = require('rxjs/Rx');
const just = require('../../extensions/just');

describe('just', () => {
  it('should change the current value to the specified one', done => {
    const obs = Rx.Observable.of('something');
    just.extend(obs);
    obs.just('test').subscribe(
      val => {
        expect(val).to.eq('test');
      },
      e => expect.fail(null, null, e.message),
      done
    );
  });
});
