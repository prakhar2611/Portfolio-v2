import Experience from './Experience/Experience.js'

const canvas = document.querySelector('canvas.webgl')
const xp = new Experience(canvas)

// Hook loading bar to real asset progress
const loadingScreen = document.getElementById('loading-screen')
const loaderBar = document.getElementById('loader-bar')

xp.resources.on('itemLoaded', ({ loaded, total }) => {
  loaderBar.style.width = `${(loaded / total) * 100}%`
})

xp.resources.on('ready', () => {
  setTimeout(() => {
    loadingScreen.classList.add('hidden')
  }, 400)
})
