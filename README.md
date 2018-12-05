# tiny-timer [![npm][npm-img]][npm-url] [![dependencies][dep-img]][dep-url] [![license][lic-img]][lic-url]

[npm-img]: https://img.shields.io/npm/v/tiny-timer.svg
[npm-url]: https://www.npmjs.com/package/tiny-timer
[dep-img]: https://david-dm.org/mathiasvr/tiny-timer.svg
[dep-url]: https://david-dm.org/mathiasvr/tiny-timer
[lic-img]: http://img.shields.io/:license-MIT-blue.svg
[lic-url]: http://mvr.mit-license.org

Small countdown timer and stopwatch module.

## install
```bash
$ npm install tiny-timer
```

## example
```javascript
const Timer = require('tiny-timer')

let timer = new Timer()

timer.on('tick', (ms) => console.log('tick', ms))
timer.on('done', () => console.log('done!'))
timer.on('statusChanged', (status) => console.log('status:', status))
timer.start(5000) // run for 5 seconds
```

# usage

## `timer = new Timer({ interval: 1000, stopwatch: false })`
Optionally set the refresh `interval` in ms, or `stopwatch` mode instead of countdown.

### `timer.start(duration [, interval])` {
Starts timer running for a `duration` specified in ms.
Optionally override the default refresh `interval` in ms.

### `timer.stop()`
Stops timer.

### `timer.pause()`
Pauses timer.

### `timer.resume()`
Resumes timer.

## events

### `timer.on('tick', (ms) => {})`
Event emitted every `interval` with the current time in ms.

### `timer.on('done', () => {})`
Event emitted when the timer reaches the `duration` set by calling `timer.start()`.

### `timer.on('statusChanged', (status) => {})`
Event emitted when the timer status changes.

## properties

### `timer.time`
Gets the current time in ms.

### `timer.duration`
Gets the total `duration` the timer is running for in ms.

### `timer.status`
Gets the current status of the timer as a string: `running`, `paused` or `stopped`.
