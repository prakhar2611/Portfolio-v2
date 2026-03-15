export default class EventEmitter {
  constructor() {
    this._callbacks = {}
  }

  on(names, callback) {
    if (!names || typeof callback !== 'function') return this
    names.split(' ').forEach(name => {
      if (!this._callbacks[name]) this._callbacks[name] = []
      this._callbacks[name].push(callback)
    })
    return this
  }

  off(names) {
    names.split(' ').forEach(name => {
      delete this._callbacks[name]
    })
    return this
  }

  trigger(name, args = []) {
    if (!this._callbacks[name]) return
    this._callbacks[name].forEach(cb => cb(...args))
    return this
  }
}
