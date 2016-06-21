'use strict';
/* eslint-env node, mocha */
/* global expect, sinon */
/* eslint prefer-arrow-callback: 0 */
const Rx = require('rx');
require('../helper');
const matching = require('../../extensions/matching');

describe('matching', function () {
  it('should merge two observables using a condition', function (done) {
    const obs1 = Rx.Observable.from([
      {id: 1, value: 'a'},
      {id: 2, value: 'b'},
      {id: 3, value: 'c'}
    ]);
    const obs2 = Rx.Observable.from([
      {foreignId: 6, value2: 'invalid' },
      {foreignId: 1, value2: 'valid' },
      {foreignId: 5, value2: 'invalid' },
      {foreignId: 7, value2: 'invalid' },
      {foreignId: 3, value2: 'valid' },
      {foreignId: 2, value2: 'valid' },
      {foreignId: 4, value2: 'invalid' }
    ]);
    matching.extend(obs1);

    let count = 3;
    obs1.matching(obs2, a => a.id, (id, b) => id === b.foreignId)
      .forEach(
        merged => {
          count--;
          expect(merged[1].value2).to.eq('valid');
        },
        e => expect.fail(null, null, e.message),
        () => {
          expect(count).to.eq(0);
          done();
        }
      );
  });
});