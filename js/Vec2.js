class Vec2 {

  constructor(x, y){
    this.x = x
    this.y = y
  }

  getAngle(){
    return Math.atan2(this.y, this.x)
  }
  
  getLength(){
    return Math.sqrt(this.x*this.x + this.y*this.y)
  }

  add(vec){
    this.x += vec.x
    this.y += vec.y
  }
  
  sub(vec){
    this.x -= vec.x
    this.y -= vec.y
  }
  
  set(x, y){
    this.x = x
    this.y = y
  }
  
  multiply(value){
    this.x *= value
    this.y *= value
  }
  
  dot(vec){
    return this.x * vec.x + this.y * vec.y
  }

  static minus(v1, v2){
    return new Vec2(v1.x - v2.x, v1.y - v2.y)
  }

  static projectUonV(vecU, vecV){
    const v = vecV.copy()
    v.multiply( vecU.dot(vecV) / vecV.dot(vecV) )
    return v
  }

  copy(){
    return new Vec2(this.x, this.y)
  }

}
