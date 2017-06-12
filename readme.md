# Rx Flow Extensions

These are simple extensions to make handling some common Rx flows a bit
more simple.

# Instalation:

```
$ npm install --save rx-flow-extensions
```

# Usage

The library can be used in three ways
### Directly accessing the helper methods:
```js
const Rx = require('rxjs/Rx');
const RxFlowExt = require('rx-flow-extensions');

const obs = Rx.Observable.of(1);
RxFlowExt.just(obs, 2)
  .then(console.log); // 2
```
**Important!** when using functions this way, the first parameter is always the
observable
### Extending a specific observable:
```js
const Rx = require('rxjs/Rx');
const RxFlowExt = require('rx-flow-extensions');

const obs = Rx.Observable.of(1);
RxFlowExt.extend(obs);
obs.just(2)
  .then(console.log); // 2
```
### Extending all observables
```js
const Rx = require('rxjs/Rx');
const RxFlowExt = require('rx-flow-extensions');
RxFlowExt.extend(Rx.Observable.prototype);

const obs = Rx.Observable.of(1);
obs.just(2)
  .then(console.log); // 2
```

### Removing the extensions
You can reset an extended object (i.e. remove all the added methods) by running
```js
const Rx = require('rxjs/Rx');
const RxFlowExt = require('rx-flow-extensions');
RxFlowExt.extend(Rx.Observable.prototype);
RxFlowExt.reset(Rx.Observable.prototype);

const obs = Rx.Observable.of(1);
obs.just(2) // obs.just is not a function
  .then(console.log);
```


# Methods

All methods can be called using the 3 options shown above, we'll assume we have
extended all observables for all examples.

## `cached(time)`
It will cache the last result provided by the observable for `time` milliseconds.
It won't ask the observable for new values during that time
```js
const rest = require('rest');
const mime = require('rest/interceptor/mime');
const client = rest.wrap(mime); // Using cujojs/rest
const slow = Rx.Observable.of('my/slow/service/url') // {value: 1}
  .cached(10000)
  .map(res => res.value);

slow.subscribe(console.log); // 1 (will call my/slow/service/url)
slow.subscribe(console.log); // 1 (won't call my/slow/service/url)
setTimeout(
  () => slow.subscribe(console.log),
  11000
); // 1 (after 11000 ms, will call my/slow/service/url)

```

## `flatten()`
It will flatten an observable of observables of values into an observable of values
```js
Rx.Observable.range(0, 5)
  .map(v => Rx.Observable.of('test'))
  .flatten()
  .subscribe(console.log); // test! (5 times)
```

## `just(value)`
It just maps the emitted observable values to the specified `value`
```js
Rx.Observable.range(0, 5)
  .just('test!')
  .subscribe(console.log); // test! (5 times)
```

## `matching(obs2, groupBy, condition)`
It will merge two observers based on a condition (similar to how two tables are
merged in a RDBMS).
```js
const obs1 = Rx.Observable.from([
  {id: 1, value: 'value a'},
  {id: 2, value: 'value b'},
  {id: 3, value: 'value c'}
]);
const obs2 = Rx.Observable.from([
  {foreignId: 3, value2: 'matches' },
  {foreignId: 2, value2: 'matches' },
  {foreignId: 4, value2: 'does not match' }
  {foreignId: 1, value2: 'matches' },
]);

obs1.matching(obs2, a => a.id, (id, b) => id = b.foreignId)
  .subscribe(console.log); /* will emmit:
    [{id: 1, value: 'value a'}, {foreignId: 1, value2: 'matches' }]
    [{id: 2, value: 'value b'}, {foreignId: 2, value2: 'matches' }]
    [{id: 3, value: 'value c'}, {foreignId: 3, value2: 'matches' }]
```

## `polling(interval, maxAttempts)`
It will get elements emitted by the observable, waiting `interval` milliseconds.
It will stop after `maxAttempts`.

This method is useful for polling a web service repeatedly until a condition
is met.
```js
const rest = require('rest');
const mime = require('rest/interceptor/mime');
const client = rest.wrap(mime); // Using cujojs/rest
Rx.Observable.of('my/polling_results/service/url') // {results: [...], finished: true|false}
  .flatMap(client)
  .polling(1000, 5)
  .map(res => res.entity)
  .takeWhileInclusive(res => !res.finished)
  .flatMap(res => Rx.Observable.fromArray(results))
  .distinct()
  .subscribe(console.log); // result1 result2 result3... After 5 attempts or finished === true
```

## `takeWhileInclusive(condition)`
It will take elements while the condition is true, including the element after
the condition fails for the first time (similar effect to `do while` loops)
```js
Rx.Observable.range(0, 5)
  .takeWhileInclusive(x => x < 3)
  .subscribe(console.log); // 0 1 2 3
```
