import { gsap } from 'gsap'
import Experience from './Experience.js'
import InfoPanel from './InfoPanel.js'

const ZONE_ORDER = ['overview', 'gaming', 'art', 'desk', 'sports']

export default class Navigation {
  constructor() {
    const xp = Experience.getInstance()
    this.camera = xp.camera
    this.infoPanel = new InfoPanel()

    this._currentIndex = 0
    this._currentZone = 'overview'

    this._dots = Array.from(document.querySelectorAll('.nav-dot'))
    this._label = document.getElementById('zone-label')

    this._setupDots()
    this._setupKeyboard()
    this._setupTouch()
    this._updateLabel('overview')
  }

  navigateTo(zoneId) {
    const idx = ZONE_ORDER.indexOf(zoneId)
    if (idx === -1) return
    if (zoneId === this._currentZone) return

    this._currentZone = zoneId
    this._currentIndex = idx

    this.camera.transitionTo(zoneId)
    this._updateDots(zoneId)
    this._updateLabel(zoneId)

    // Show info panel for non-overview zones, hide for overview
    if (zoneId === 'overview') {
      this.infoPanel.hide()
    } else {
      setTimeout(() => this.infoPanel.show(zoneId), 700)
    }
  }

  _setupDots() {
    this._dots.forEach(dot => {
      dot.addEventListener('click', () => {
        this.navigateTo(dot.dataset.zone)
      })
    })
  }

  _setupKeyboard() {
    document.addEventListener('keydown', e => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        const next = (this._currentIndex + 1) % ZONE_ORDER.length
        this.navigateTo(ZONE_ORDER[next])
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        const prev = (this._currentIndex - 1 + ZONE_ORDER.length) % ZONE_ORDER.length
        this.navigateTo(ZONE_ORDER[prev])
      }
    })
  }

  _setupTouch() {
    let startX = 0
    document.addEventListener('touchstart', e => { startX = e.touches[0].clientX }, { passive: true })
    document.addEventListener('touchend', e => {
      const dx = e.changedTouches[0].clientX - startX
      if (Math.abs(dx) < 40) return
      if (dx < 0) {
        const next = (this._currentIndex + 1) % ZONE_ORDER.length
        this.navigateTo(ZONE_ORDER[next])
      } else {
        const prev = (this._currentIndex - 1 + ZONE_ORDER.length) % ZONE_ORDER.length
        this.navigateTo(ZONE_ORDER[prev])
      }
    }, { passive: true })
  }

  _updateDots(zoneId) {
    this._dots.forEach(dot => {
      dot.classList.toggle('active', dot.dataset.zone === zoneId)
    })
  }

  _updateLabel(zoneId) {
    const labels = {
      overview: 'Welcome',
      gaming: 'The Gaming Corner',
      art: 'The Art Wall',
      desk: 'The Work Desk',
      sports: 'The Trophy Shelf'
    }
    this._label.textContent = labels[zoneId] || ''
    this._label.classList.remove('visible')
    setTimeout(() => this._label.classList.add('visible'), 50)
  }

  // Called by Interaction when a zone trigger is clicked
  onZoneClick(zoneId) {
    this.navigateTo(zoneId)
  }
}
