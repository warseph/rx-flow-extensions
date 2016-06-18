'use strict';
/* eslint-env node, mocha */
/* global expect, sinon */
/* eslint prefer-arrow-callback: 0 */
/* eslint no-unused-expressions: 0 */
const Rx = require('rx');
require('../helper');
const cached = require('../../extensions/cached');

describe('cached', function () {
  let clock;
  before(() => { clock = sinon.useFakeTimers(); });
  after(() => clock.restore());

  it('should get the value from the observable the first time', function (done) {
    const tester = sinon.spy();
    const map = sinon.spy(v => v + 1);
    const mapped = Rx.Observable.just(null).map(map);
    cached.extend(mapped);
    const obs = mapped.cached(100);
    obs.subscribe(
      tester,
      e => expect.fail(null, null, e.message),
      () => {
        expect(tester).to.have.calledOnce;
        expect(map).to.have.been.calledOnce;
        expect(tester).to.have.been.calledWith(1);
        done();
      }
    );
  });

  it('should have cached elements for a second call`', function (done) {
    const tester = sinon.spy();
    const map = sinon.spy(v => v + 1);
    const mapped = Rx.Observable.just(null).map(map);
    cached.extend(mapped);
    const obs = mapped.cached(100);
    obs.subscribe(tester);
    obs.subscribe(
      tester,
      e => expect.fail(null, null, e.message),
      () => {
        expect(tester).to.have.calledTwice;
        expect(map).to.have.been.calledOnce;
        expect(tester).to.have.been.calledWith(1);
        done();
      }
    );
  });

  it('should cache elements for the specified time', function (done) {
    const tester = sinon.spy();
    const map = sinon.spy(v => v + 1);
    const mapped = Rx.Observable.just(null).map(map);
    cached.extend(mapped);
    const obs = mapped.cached(100);
    setTimeout(
      () => {
        obs.subscribe(
          tester,
          e => expect.fail(null, null, e.message),
          () => {
            expect(tester).to.have.calledTwice;
            expect(map).to.have.been.calledTwice;
            expect(tester).to.have.been.calledWith(1);
            done();
          }
        );
      },
      100);
    obs.doOnCompleted(() => clock.tick(100)).subscribe(tester);
  });

  it('should recache elements after invalidating', function (done) {
    const tester = sinon.spy();
    const map = sinon.spy(v => v + 1);
    const mapped = Rx.Observable.just(null).map(map);
    cached.extend(mapped);
    const obs = mapped.cached(100);
    setTimeout(
      () => {
        obs.subscribe(tester);
        obs.subscribe(
          tester,
          e => expect.fail(null, null, e.message),
          () => {
            expect(tester).to.have.calledTwice;
            expect(map).to.have.been.calledTwice;
            expect(tester).to.have.been.calledWith(1);
            done();
          }
        );
      },
      100);
    obs.doOnCompleted(() => clock.tick(100)).subscribe();
  });
});
