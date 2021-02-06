const TWOPI = Math.PI * 2

let scale, canvas, c, u, w, h, r, hitFx, holeFx
let spheres, holes

let sphere, startPos, endPos, startTime, endTime

const init = () => {
  scale = devicePixelRatio;
  canvas = document.createElement('canvas')
  w = innerWidth
  h = innerHeight
  r = Math.floor(w * h * scale * 0.000025)
  canvas.width = w * scale
  canvas.height = h * scale
  canvas.style.width = `${w}px`
  canvas.style.height = `${h}px`
  c = canvas.getContext('2d')
  c.scale(scale, scale)
  c.textAlign = 'center'
  c.textBaseline = 'middle'
  c.font = `${r*0.8}px Arial`
  document.body.appendChild(canvas)
  addEvent()
  createAudioFx()
  createSpheres()
  createHoles()
  resetSphereParams()
  update()
}

const createAudioFx = () => {
  hitFx = new Audio()
  hitFx.src = 'audio/hit.mp3'
  hitFx.autoplay = false
  holeFx = new Audio()
  holeFx.src = 'audio/hole.mp3'
  holeFx.autoplay = false
}

const createSpheres = () => {
  spheres = []
  let index = 0
  for(let i = 0; i < 5; i++){
    for(let j = 0; j < i+1; j++){
      let posx = w/2 - i*r*2 - w/5
      let posy = h/2 - j*r*2 + (i*r)
      if(h > w){
        posx = w/2 - j*r*2 + (i*r)
        posy = h/2 - i*r*2 - h/5
      }
      spheres.push(
        new Sphere(posx, posy, r, `hsl(${index++ * (360/15)}, 100%, 50%)`, '3d', index)
      )
    }
  }
  spheres.push(
    h > w ? new Sphere(w/2, h/2+h/3, r, 'hsl(360, 100%, 100%)'): new Sphere(w/2+w/3, h/2, r, 'hsl(360, 100%, 100%)')
  )
}

const createHoles = () => {
  holes = [
    new Sphere(r/2, r/2, r+r*0.2, 'black', '2d'),
    new Sphere(w-r/2, r/2, r+r*0.2, 'black', '2d'),
    new Sphere(r/2, h-r/2, r+r*0.2, 'black', '2d'),
    new Sphere(w-r/2, h-r/2, r+r*0.2, 'black', '2d')
  ]
  if(w >= h){
    holes = holes.concat([
      new Sphere(w/2, 0, r+r*0.2, 'black', '2d'),
      new Sphere(w/2, h, r+r*0.2, 'black', '2d')
    ])
  }else{
    holes = holes.concat([
      new Sphere(0, h/2, r+r*0.2, 'black', '2d'),
      new Sphere(w, h/2, r+r*0.2, 'black', '2d')
    ])
  }
}

const update = () => {
  show()
  for(const sphere of spheres)
    sphere.update()
  spheresCollision()
  u = window.requestAnimationFrame(update)
}

const show = () => {
  c.clearRect(0, 0, w, h)
  for(const hole of holes)
    hole.show()
  for(const sphere of spheres)
    sphere.show()
}

const spheresCollision = () => {
  for(let i = 0; i < spheres.length - 1; i++)
    for(let j = i + 1; j < spheres.length; j++)
      if(d = spheres[i].collideSphere(spheres[j])){
        let tmp = hitFx.cloneNode(true)
        tmp.volume = Math.min(Math.max(d, 0.1), 0.98)
        tmp.currentTime = 0
        tmp.play()
      }
  for(let i = spheres.length - 1; i >= 0; i--){
    for(const hole of holes){
      if(spheres[i].collideHole(hole)){
        let tmp = holeFx.cloneNode(true)
        tmp.currentTime = 0
        tmp.play()
      }
    }
    if(spheres[i].isGone)
      spheres.splice(i, 1)
  }
}

const resetSphereParams = () => sphere = startPos = endPos = startTime = endTime = null

const getPos = e => {
  if('changedTouches' in e){
    return {x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY}
  } else {
    return {x: e.clientX, y: e.clientY}
  }
}

const getSphere = (pos) => {
  for(const sphere of spheres)
    if((sphere.pos.x - pos.x) ** 2 + (sphere.pos.y - pos.y) ** 2 < sphere.r ** 2)
      return sphere
  return null
}

const playSphere = (e) => {
  const pos = getPos(e)
  sphere = getSphere(pos)
  if(!sphere)
    return
  startPos = pos
  startTime = performance.now()
}

const dropSphere = (e) => {
  if(!sphere)
    return
  endPos = getPos(e)
  endTime = performance.now()
  const a = Math.atan2(startPos.y - endPos.y, startPos.x - endPos.x)
  const deltaTime = endTime - startTime
  const l = -Math.max(Math.sqrt((startPos.x - endPos.x) ** 2 + (startPos.y - endPos.y) ** 2) / deltaTime * 12, 7)
  sphere.acc = new Vec2(Math.cos(a) * l, Math.sin(a) * l)
  resetSphereParams()
}

const addEvent = () => {
  document.addEventListener("touchmove", e => e.preventDefault())
  canvas.addEventListener('mousedown', playSphere)
  canvas.addEventListener('mouseup', dropSphere)
  canvas.addEventListener('touchstart', playSphere)
  canvas.addEventListener('touchend', dropSphere)
}

window.addEventListener('resize', () => {
  canvas.remove()
  window.cancelAnimationFrame(u)
  init()
})

init()
