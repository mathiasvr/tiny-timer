import EventEmitter from 'events'

const status = {
  _stopped: 'stopped',
  _running: 'running',
  _paused: 'paused'
}

function tick () {
  if (this._status === status._paused) return
  if (Date.now() >= this._endTime) {
    this.stop()
    this.emit('tick', this._stopwatch ? this._duration : 0)
    this.emit('done')
  } else {
    this.emit('tick', this.time)
  }
}

class Timer extends EventEmitter {
  constructor ({ interval = 1000, stopwatch = false } = {}) {
    super()
    this._interval = interval
    this._stopwatch = stopwatch
    this._endTime = 0
    this._pauseTime = 0
    this._duration = null
    this._timeoutID = null
    this._status = status._stopped // 'running' or 'paused'
  }

  start (duration, interval) {
    if (this._status !== status._stopped) return
    if (duration == null) throw new TypeError('must provide duration parameter')
    this._duration = duration
    this._endTime = Date.now() + duration
    this.changeStatus(status._running)
    this.emit('tick', this._stopwatch ? 0 : this._duration)
    this._timeoutID = setInterval(tick.bind(this), interval || this._interval)
  }

  stop () {
    clearInterval(this._timeoutID)
    this.changeStatus(status._stopped)
  }

  pause () {
    if (this._status !== status._running) return
    this._pauseTime = Date.now()
    this.changeStatus(status._paused)
  }

  resume () {
    if (this._status !== status._paused) return
    this._endTime += Date.now() - this._pauseTime
    this._pauseTime = 0
    this.changeStatus(status._running)
  }
  
  changeStatus (status) {
    this._status = status
    this.emit('onChangeStatus', this._status)
  }

  get time () {
    if (this._status === status._stopped) return 0
    let time = this._status === status._paused ? this._pauseTime : Date.now()
    let left = this._endTime - time
    return this._stopwatch ? this._duration - left : left
  }

  get duration () {
    return this._duration
  }

  get status () {
    return this._status
  }
}

export default Timer
