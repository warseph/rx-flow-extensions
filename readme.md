# Rx Flow Extensions

This are simple extensions to make handling some common Rx flows a bit
more simple.

# Instalation:

```
$ npm install --save rx-flow-extensions
```

# Usage

The library can be used in three ways
### Directly accessing the helper methods:
```js
const Rx = require('rx');
const RxFlowExt = require('rx-flow-extensions');

const obs = Rx.Observable.just(1);
RxFlowExt.just(obs, 2)
  .then(console.log); // 2
```
**Important!** when using functions this way, the first parameter is always the
observable
### Extending a specific observable:
```js
const Rx = require('rx');
const RxFlowExt = require('rx-flow-extensions');

const obs = Rx.Observable.just(1);
RxFlowExt.extend(obs);
obs.just(2)
  .then(console.log); // 2
```
### Extending all observables
```js
const Rx = require('rx');
const RxFlowExt = require('rx-flow-extensions');
RxFlowExt.extend(Rx.Observable.prototype);

const obs = Rx.Observable.just(1);
obs.just(2)
  .then(console.log); // 2
```

# Methods

All methods can be called using the 3 options shown above, we'll assume we have
extended all observables for all examples.

## `just(value)`
It just maps the emitted observable values to the specified `value`
```js
Rx.Observable.range(0, 5)
  .just('test!')
  .forEach(console.log); // test! (5 times)
```

## `takeWhileInclusive(condition)`
It will take elements while the condition is true, including the element after
the condition fails for the first time (similar effect to `do while` loops)
```js
Rx.Observable.range(0, 5)
  .takeWhileInclusive(x => x < 3)
  .forEach(console.log); // 0 1 2 3
```
