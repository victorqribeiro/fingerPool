class Sphere {

  constructor(x, y, r, c, effect, t){
    this.pos = new Vec2(x || 0, y || 0)
    this.acc = new Vec2(0,0)
    this.vel = new Vec2(0,0)
    this.r = r
    this.c = c
    this.a = 0
    this.effect = effect || '3d'
    this.t = t || ''
    this.isGone = false
  }
  
  update(){
    this.vel.add( this.acc )
    this.pos.add( this.vel )
    this.acc.set(0,0)
    this.vel.multiply(0.98)
    this.edge()
  }
  
  edge(){
    if(this.pos.x - this.r < 0 || this.pos.x + this.r > w){
      this.pos.x = Math.min(Math.max(this.pos.x, this.r), w-this.r)
      this.vel.x = -this.vel.x
    }
    if(this.pos.y - this.r < 0 || this.pos.y + this.r > h){
      this.pos.y = Math.min(Math.max(this.pos.y, this.r), h-this.r)
      this.vel.y = -this.vel.y
    }
  }
  
  collideSphere(sphere){
    let {dx, dy, dist} = this.getDist(sphere)
    if(dist <= this.r + sphere.r){
      dx /= dist
      dy /= dist
      this.pos.x += dx
      this.pos.y += dy
      sphere.pos.x -= dx
      sphere.pos.y -= dy
      const nv1 = this.vel.copy()
      nv1.add( Vec2.projectUonV(sphere.vel, Vec2.minus(sphere.pos, this.pos)) )
      nv1.sub( Vec2.projectUonV(this.vel, Vec2.minus(this.pos, sphere.pos)) )
      const nv2 = sphere.vel.copy()
      nv2.add( Vec2.projectUonV(this.vel, Vec2.minus(sphere.pos, this.pos)) )
      nv2.sub( Vec2.projectUonV(sphere.vel, Vec2.minus(this.pos, sphere.pos)) )
      this.vel = nv1
      sphere.vel = nv2
      return nv1.getLength() / 7
    }
    return null
  }
  
  collideHole(hole){
    const {dist} = this.getDist(hole)
    if(dist < this.r + this.r/2){
      this.isGone = true
      return true
    }
    return false
  }
  
  getDist(sphere){
    const dx = this.pos.x - sphere.pos.x
    const dy = this.pos.y - sphere.pos.y
    const dist = Math.sqrt(dx * dx + dy * dy)
    return {dx, dy, dist}
  }
  
  show(){
    c.beginPath()
    c.arc(this.pos.x, this.pos.y, this.r, 0, TWOPI)
    c.fillStyle = this.c
    c.shadowOffsetX = 0
    c.shadowOffsetY = 0
    c.shadowBlur = 0
    if(this.effect === '3d'){
      c.shadowColor = 'rgba(0,0,0,0.5)'
      c.shadowOffsetX = -5
      c.shadowOffsetY = 5
      c.shadowBlur = 5
      const gradient = c.createRadialGradient(this.pos.x+this.r/2, this.pos.y-this.r/2, 0, this.pos.x, this.pos.y, this.r)
      gradient.addColorStop(0, this.c)
      gradient.addColorStop(1, this.c.match(/50%\)/) ? this.c.replace('50%)', '10%)') : 'hsla(0, 0%, 60%)')
      c.fillStyle = gradient
    }
    c.fill()
    c.shadowColor = 'transparent'
    if(this.t){
      c.fillStyle = 'rgba(256, 256, 256, 0.6)'
      c.beginPath()
      c.arc(this.pos.x, this.pos.y, this.r * 0.6, 0, TWOPI);
      c.fill()
      c.fillStyle = 'black'
      c.fillText(this.t, this.pos.x, this.pos.y)
    }
  }

}
