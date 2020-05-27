import { EventEmitter } from 'events'

type Status = 'running' | 'paused' | 'stopped'

export class Timer extends EventEmitter {
  private _interval: number
  private _endTime: number = 0
  private _pauseTime: number = 0
  private _status: Status = 'stopped'
  private _timeoutID?: NodeJS.Timeout

  constructor ({ interval = 1000 } = {}) {
    super()
    this._interval = interval
  }

  public start (duration: number, interval?: number) {
    if (this.status !== 'stopped') throw new Error('Timer has already been started')
    if (duration == null) throw new TypeError('Must provide duration parameter')
    if (interval) this._interval = interval
    this._run(duration)
  }

  public stop () {
    if (this.status !== 'stopped') {
      if (this._timeoutID) clearInterval(this._timeoutID)
      this._changeStatus('stopped')
    }
  }

  public pause () {
    if (this.status === 'running') {
      this._pauseTime = Date.now()
      if (this._timeoutID) clearInterval(this._timeoutID)
      this._changeStatus('paused')
    }
  }

  public resume () {
    if (this.status === 'paused') {
      this._run(this._endTime - this._pauseTime)
    }
  }

  private _run (duration: number) {
    this._endTime = Date.now() + duration
    this._changeStatus('running')
    this.emit('tick', duration)
    this._timeoutID = setInterval(this._tick, this._interval)
  }

  private _changeStatus (status: Status) {
    this._status = status
    this.emit('statusChanged', this.status)
  }

  private _tick = () => {
    if (this.status === 'paused') return
    if (Date.now() >= this._endTime) {
      this.stop()
      this.emit('tick', 0)
      this.emit('done')
    } else {
      this.emit('tick', this.time)
    }
  }

  get time () {
    if (this.status === 'stopped') return 0
    const time = this.status === 'paused' ? this._pauseTime : Date.now()
    return this._endTime - time
  }

  get status () {
    return this._status
  }
}
