'use strict';
/* eslint-env node, mocha */
/* global expect, sinon */
/* eslint prefer-arrow-callback: 0 */
const Rx = require('rx');
require('../helper');
const just = require('../../extensions/just');

describe('just', function () {
  it('should change the current value to the specified one', function (done) {
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
