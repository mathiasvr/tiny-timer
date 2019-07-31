# tiny-timer

[![npm](https://img.shields.io/npm/v/tiny-timer.svg)](https://npm.im/tiny-timer)
[![Build Status](https://travis-ci.com/mathiasvr/tiny-timer.svg?branch=master)](https://travis-ci.com/mathiasvr/tiny-timer)
![downloads](https://img.shields.io/npm/dt/tiny-timer.svg)
[![dependencies](https://david-dm.org/mathiasvr/tiny-timer.svg)](https://david-dm.org/mathiasvr/tiny-timer)
[![license](https://img.shields.io/:license-MIT-blue.svg)](https://mvr.mit-license.org)

Small countdown timer and stopwatch module.

## Installation
npm:
```shell
$ npm install tiny-timer
```
Yarn:
```shell
$ yarn add tiny-timer
```

## Example
```javascript
const Timer = require('tiny-timer')

const timer = new Timer()

timer.on('tick', (ms) => console.log('tick', ms))
timer.on('done', () => console.log('done!'))
timer.on('statusChanged', (status) => console.log('status:', status))

timer.start(5000) // run for 5 seconds
```

## Usage

### `timer = new Timer({ interval: 1000, stopwatch: false })`
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

## Events

### `timer.on('tick', (ms) => {})`
Event emitted every `interval` with the current time in ms.

### `timer.on('done', () => {})`
Event emitted when the timer reaches the `duration` set by calling `timer.start()`.

### `timer.on('statusChanged', (status) => {})`
Event emitted when the timer status changes.

## Properties

### `timer.time`
Gets the current time in ms.

### `timer.duration`
Gets the total `duration` the timer is running for in ms.

### `timer.status`
Gets the current status of the timer as a string: `running`, `paused` or `stopped`.
