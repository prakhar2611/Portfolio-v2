import Experience from './Experience.js'

const canvas = document.querySelector('canvas.webgl')
const xp = new Experience(canvas)

// Fade out loading screen
const loadingScreen = document.getElementById('loading-screen')
const loaderBar = document.getElementById('loader-bar')

// Simulate loading progress then fade out
let progress = 0
const interval = setInterval(() => {
  progress += Math.random() * 18
  if (progress >= 100) {
    progress = 100
    clearInterval(interval)
    setTimeout(() => {
      loadingScreen.classList.add('hidden')
    }, 400)
  }
  loaderBar.style.width = `${progress}%`
}, 80)
