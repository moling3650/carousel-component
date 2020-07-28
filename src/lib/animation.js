export class Timeline {

  constructor (animations) {
    this.animations = new Set();
    this.animationStartTimes = new Map();
    this.requestID = null;
    this.state = 'inited';
    this.startTime = null;
    this.pauseTime = null;
    this.tick = () => {
      const time = Date.now() - this.startTime;
      
      for (const animation of this.animations) {        
        const completed = animation.move(time, this.animationStartTimes.get(animation));
        if (completed) {
          this.animations.delete(animation);
          this.animationStartTimes.delete(animation);
        }
      }
      if (this.state === 'playing') {        
        this.requestID = (this.animations.size) ? requestAnimationFrame(this.tick) : null;
      }
    }
  }

  add(animation, startTime) {
    this.animations.add(animation);
    if (this.state === 'playing') {
      this.animationStartTimes.set(animation, startTime !== void 0 ? startTime : Date.now() - this.startTime);
      this.tick()
    } else {
      this.animationStartTimes.set(animation, startTime !== void 0 ? startTime : 0);
    }
  }

  reset() {
    this.pause()
    this.animations.clear();
    this.animationStartTimes.clear();
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
  }

  computeProgression(time, startTime) {
    if (time < startTime + this.delay) {
      return 0;
    } else if (time > startTime + this.delay + this.duration) {
      return 1;
    } else {
      return this.timingFunction((time - (startTime + this.delay)) / this.duration);
    }
  }

  move(time, startTime) {
    let progression = this.computeProgression(time, startTime);
    if (progression > 0) {      
      const value = this.start + progression * (this.end - this.start);
      this.object[this.property] = this.template(value);
    }
    return progression === 1;
  }
}