import Experience from '../Experience.js'
import RoomWorld from './RoomWorld.js'
import Environment from './Environment.js'

export default class World {
  constructor() {
    const xp = Experience.getInstance()
    this.resources = xp.resources

    this.resources.on('ready', () => {
      this.roomWorld = new RoomWorld()
      this.environment = new Environment()
    })
  }

  update() {}
}
