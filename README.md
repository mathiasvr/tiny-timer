# tiny-timer [![dependencies][dep-img]][dep-url] [![license][lic-img]][lic-url]

[dep-img]: https://david-dm.org/mathiasvr/tiny-timer.svg
[dep-url]: https://david-dm.org/mathiasvr/tiny-timer
[lic-img]: http://img.shields.io/:license-MIT-blue.svg
[lic-url]: http://mvr.mit-license.org

Small countdown timer and stopwatch module.

## install
```bash
npm install tiny-timer
```

## example
```javascript
const Timer = require('tiny-timer')

let timer = new Timer({ interval: 200 })

timer.on('tick', (ms) => console.log('tick', ms))
timer.on('done', () => console.log('done!'))

timer.start(3000) // run for 3 seconds
```

# usage

## `timer = new Timer([options])`
Optional `options`:
```javascript
{
  interval: Number,   // refresh interval in ms
  stopwatch: Boolean  // stopwatch mode, default is countdown
}
```

### `timer.start(duration)` {
Starts timer running for a `duration` specified in ms.

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

## properties

### `timer.time`
Gets the current time in ms.

### `timer.duration`
Gets the total `duration` the timer is running for in ms.

### `timer.status`
Gets the current status of the timer as a string: `running`, `paused` or `stopped`.
