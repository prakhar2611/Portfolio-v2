import Room from './Room.js'
import Lights from './Lights.js'
import GamingCorner from './GamingCorner.js'
import ArtWall from './ArtWall.js'
import WorkDesk from './WorkDesk.js'
import SportsTrophy from './SportsTrophy.js'
import Atmosphere from './Atmosphere.js'

export default class World {
  constructor() {
    this.room = new Room()
    this.lights = new Lights()
    this.gamingCorner = new GamingCorner()
    this.artWall = new ArtWall()
    this.workDesk = new WorkDesk()
    this.sportsTrophy = new SportsTrophy()
    this.atmosphere = new Atmosphere()
  }

  // Collect all interactive mesh triggers from all zones
  getInteractives() {
    return [
      ...this.gamingCorner.interactives,
      ...this.artWall.interactives,
      ...this.workDesk.interactives,
      ...this.sportsTrophy.interactives,
    ]
  }

  update() {
    this.atmosphere.update()
  }
}
