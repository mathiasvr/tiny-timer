import { EventEmitter } from 'events'

type Status = 'running' | 'paused' | 'stopped'

export class Timer extends EventEmitter {
  private _interval: number
  private _startTime: number = 0
  private _pauseTime: number = 0
  private _status: Status = 'stopped'
  private _timeoutID?: NodeJS.Timeout

  constructor ({ interval = 1000 } = {}) {
    super()
    this._interval = interval
  }

  public start (interval?: number) {
    if (this.status !== 'stopped') throw new Error('Stopwatch has already been started')
    this._changeStatus('running')
    this._startTime = Date.now() 
    this.emit('tick', 0)
    this._timeoutID = setInterval(this.tick, interval || this._interval)
  }

  public stop () {
    if (this._timeoutID) clearInterval(this._timeoutID)
    this._changeStatus('stopped')
  }

  public pause () {
    if (this.status !== 'running') return
    this._pauseTime = Date.now()
    this._changeStatus('paused')
  }

  public resume () {
    if (this.status !== 'paused') return
    this._pauseTime = 0
    this._changeStatus('running')
  }

  private _changeStatus (status: Status) {
    this._status = status
    this.emit('statusChanged', this.status)
  }

  private tick = () => {
    if (this.status === 'paused') return
    this.emit('tick', this.time)
  }

  get time () {
    if (this.status === 'stopped') return 0
    const time = this.status === 'paused' ? this._pauseTime : Date.now()
    return time - this._startTime;
  }

  get status () {
    return this._status
  }
}
