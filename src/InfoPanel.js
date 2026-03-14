import { gsap } from 'gsap'

const ZONE_DATA = {
  overview: {
    title: 'Hey, I\'m Prakhar',
    tagline: 'Software Engineer · Artist · Gamer',
    body: `
      <p>Welcome to my den — the place where code, art, and chaos coexist peacefully.
      I'm an introvert who speaks fluent JavaScript and mediocre small talk.</p>
      <p>Navigate the room to learn more about me. Click the dots or use arrow keys.</p>
    `,
    tags: ['Problem Solver', 'Full Stack', 'Creative', 'Competitive'],
    links: []
  },
  gaming: {
    title: 'The Gaming Corner',
    tagline: 'PS5 · Garmin · Home Base',
    body: `
      <p>This is where I decompress. A controller in hand, metrics on my Garmin,
      and the perfect playlist on in the background.</p>
      <p>I'm a firm believer that rest is a performance metric — and my Garmin data
      backs that up. Recovery days are sacred.</p>
      <p>Health-conscious doesn't mean I can't enjoy the couch. It means I've optimised both.</p>
    `,
    tags: ['PS5', 'Garmin Watch', 'Health Data', 'Introvert Mode'],
    links: []
  },
  art: {
    title: 'The Art Wall',
    tagline: 'Painter · Creator · Visual Thinker',
    body: `
      <p>Before I wrote code, I painted. Art is how I process complexity —
      turning noise into something with shape and colour.</p>
      <p>I paint in oils mostly. Landscapes, abstracts, and the occasional portrait that
      looks nothing like who I was painting.</p>
      <p>The canvas on the easel is whatever I'm currently obsessing over.</p>
    `,
    tags: ['Oil Painting', 'Abstract Art', 'Visual Art', 'Creative'],
    links: []
  },
  desk: {
    title: 'The Work Desk',
    tagline: 'Software Engineer · Builder · Problem Solver',
    body: `
      <p>I'm a full-stack software engineer with a deep love for solving hard problems
      and building things that actually work.</p>
      <p>My stack spans frontend, backend, and the infrastructure gluing it all together.
      I care about clean systems and maintainable code.</p>
    `,
    tags: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'Three.js', 'AWS'],
    links: [
      { label: '→ GitHub', url: 'https://github.com/prakhar2611' },
      { label: '→ LinkedIn', url: '#' },
    ]
  },
  sports: {
    title: 'The Trophy Shelf',
    tagline: 'Table Tennis · Badminton · Competitor',
    body: `
      <p>Table tennis is my sport. Fast, technical, and deeply satisfying when you
      land that perfect cross-table smash.</p>
      <p>Badminton keeps me sharp and surprisingly social — turns out you can be an
      introvert and still dominate a court.</p>
      <p>I play to win. These trophies didn't get here by being polite on the table.</p>
    `,
    tags: ['Table Tennis', 'Badminton', 'Competitive', 'Athletics'],
    links: []
  }
}

export default class InfoPanel {
  constructor() {
    this.panel = document.getElementById('info-panel')
    this.content = document.getElementById('info-content')
    this.closeBtn = document.getElementById('info-close')
    this._currentZone = null

    this.closeBtn.addEventListener('click', () => this.hide())
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') this.hide()
    })
  }

  show(zoneId) {
    if (this._currentZone === zoneId && this.panel.classList.contains('open')) return
    this._currentZone = zoneId
    const data = ZONE_DATA[zoneId]
    if (!data) return

    this.content.innerHTML = this._buildHTML(data)
    this.panel.classList.add('open')

    // Animate children in
    const children = Array.from(this.content.children)
    gsap.fromTo(children,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: 'power2.out', delay: 0.1 }
    )
  }

  hide() {
    if (!this.panel.classList.contains('open')) return
    gsap.to(this.panel, {
      x: '100%',
      duration: 0.3,
      ease: 'power2.in',
      onComplete: () => {
        this.panel.classList.remove('open')
        this.panel.style.transform = ''
        this._currentZone = null
      }
    })
  }

  _buildHTML(data) {
    const tagsHTML = data.tags.map(t => `<span class="tag">${t}</span>`).join('')
    const linksHTML = data.links.map(l => `<a class="link-btn" href="${l.url}" target="_blank" rel="noopener">${l.label}</a>`).join('')

    return `
      <h2>${data.title}</h2>
      <p class="tagline">${data.tagline}</p>
      <div class="divider"></div>
      ${data.body}
      ${data.tags.length ? `<div class="tags">${tagsHTML}</div>` : ''}
      ${data.links.length ? `<div class="links">${linksHTML}</div>` : ''}
    `
  }
}
