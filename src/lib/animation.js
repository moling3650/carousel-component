export class Timeline {

  constructor (animations) {
    this.animations = new Set();
    this.requestID = null;
    this.state = 'inited';
    this.startTime = null;
    this.pauseTime = null;
    this.tick = () => {
      const t = Date.now() - this.startTime;

      for (const animation of this.animations) {        
        const completed = animation.move(t);
        if (completed) {
          this.animations.delete(animation);
        }
      }
      this.requestID = (this.animations.size) ? requestAnimationFrame(this.tick) : null;
    }
  }

  add(animation, addTime) {
    this.animations.add(animation);
    if (this.state === 'playing') {
      animation.addTime = addTime !== void 0 ? addTime : Date.now() - this.startTime;
      this.tick()
    } else {
      animation.addTime = addTime !== void 0 ? addTime : 0;
    }
  }

  clear() {
    this.pause()
    this.animations.clear();
    this.requestID = null;
    this.state = 'inited';
    this.startTime = null;
    this.pauseTime = null;
  }

  start() {
    if (this.state !== 'inited') {
      return;
    }
    this.state = 'playing';
    this.startTime = Date.now();
    this.tick();
  }

  restart() {
    this.pause();
    this.requestID = null;
    this.state = 'playing';
    this.startTime = Date.now();
    this.pauseTime = null;
    this.tick();
  }

  pause() {
    if (this.state !== 'playing') {
      return;
    }
    this.state = 'paused';
    this.pauseTime = Date.now();
    this.requestID && cancelAnimationFrame(this.requestID);
  }

  resume() {
    if (this.state !== 'paused') {
      return;
    }
    this.state = 'playing';
    this.startTime += Date.now() - this.pauseTime;
    this.tick();
  } 
}

export class Animation {
  constructor(object, property, start, end, duration, delay, timingFunction, template) {
    this.object = object;
    this.property = property;
    this.start = start;
    this.end = end;
    this.duration = duration;
    this.delay = delay;
    this.timingFunction = timingFunction;
    this.template = template;
    this.addTime = 0
  }

  computeProgression(t) {
    if (t < this.delay + this.addTime) {
      return 0;
    } else if (t > this.duration + this.delay + this.addTime) {
      return 1;
    } else {
      return this.timingFunction((t - this.delay - this.addTime) / this.duration);
    }
  }

  move(t) {
    let progression = this.computeProgression(t);
    if (progression > 0) {      
      const value = this.start + progression * (this.end - this.start);
      this.object[this.property] = this.template(value);
    }
    return progression === 1;
  }
}