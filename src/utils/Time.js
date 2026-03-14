import EventEmitter from './EventEmitter.js'

export default class Time extends EventEmitter {
  constructor() {
    super()
    this.start = Date.now()
    this.current = this.start
    this.elapsed = 0
    this.delta = 16

    requestAnimationFrame(() => this._tick())
  }

  _tick() {
    const now = Date.now()
    this.delta = now - this.current
    this.current = now
    this.elapsed = now - this.start
    this.trigger('tick')
    requestAnimationFrame(() => this._tick())
  }
}
