import EventEmitter from 'events'

function tick () {
  if (this._status === 'paused') return
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
    this._status = 'stopped' // 'running' or 'paused'
  }

  start (duration, interval) {
    if (this._status !== 'stopped') return
    if (duration == null) throw new TypeError('Must provide duration parameter')
    this._duration = duration
    this._endTime = Date.now() + duration
    this._changeStatus('running')
    this.emit('tick', this._stopwatch ? 0 : this._duration)
    this._timeoutID = setInterval(tick.bind(this), interval || this._interval)
  }

  stop () {
    clearInterval(this._timeoutID)
    this._changeStatus('stopped')
  }

  pause () {
    if (this._status !== 'running') return
    this._pauseTime = Date.now()
    this._changeStatus('paused')
  }

  resume () {
    if (this._status !== 'paused') return
    this._endTime += Date.now() - this._pauseTime
    this._pauseTime = 0
    this._changeStatus('running')
  }

  _changeStatus (status) {
    this._status = status
    this.emit('statusChanged', this._status)
  }

  get time () {
    if (this._status === 'stopped') return 0
    const time = this._status === 'paused' ? this._pauseTime : Date.now()
    const left = this._endTime - time
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
