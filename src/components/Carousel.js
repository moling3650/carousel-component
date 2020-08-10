import { createElement } from "../lib/createElement";
import { Timeline, Animation } from "../lib/animation";
import { cubicBezier } from "../lib/cubicBezier";
import '../css/carousel.css'

const ease = cubicBezier(.25, 1, .25, 1);
const linear = cubicBezier(0, 0, 1, 1);

export class Carousel {
  constructor(interval = 3000) {
    this.images = [];
    this.position = 0;
    this.nextPicTimer = null;
    this.interval = interval;
    this.timeline = new Timeline();
    this.timeline.start();
  }

  get lastPosition() {
    return (this.position - 1 + this.images.length) % this.images.length;
  }

  get nextPosition() {
    return (this.position + 1) % this.images.length;
  }
 
  setAttribute(name, value) {
    this[name] = value;
  }

  render() {
    let children = this.images.map((url, pos) => {
      let offsetX = 0;
      let width = 0;

      const onStart = () => {
        this.timeline.pause();
        if (this.nextPicTimer) {
          clearTimeout(this.nextPicTimer);
        }
        const carouselRect = children[pos].root.parentElement.getBoundingClientRect();
        const imageRect = children[pos].root.getBoundingClientRect();
        width = carouselRect.width;
        offsetX = imageRect.x - carouselRect.x;
      }

      const onTap = () => {
        console.log('tap');
      }

      const onPan = ({ detail }) => {        
        this.position = pos;
        let current = children[this.position];
        let last = children[this.lastPosition];
        let next = children[this.nextPosition];
        
        const x = detail.clientX - detail.startX + offsetX;
        current.style.transform = `translateX(${x - width * this.position}px)`;
        last.style.transform = `translateX(${x - width * this.lastPosition - width}px)`;
        next.style.transform = `translateX(${x - width * this.nextPosition + width}px)`;
      }

      const onPanEnd = ({ detail }) => {
        const x = detail.clientX - detail.startX + offsetX;
        let direction = 0;
        if (detail.isFlick) {
          direction = (detail.clientX - detail.startX > 0) ? 1 : -1;
        } else if (x > (width / 2)) {
          direction = 1;
        } else if (x < -(width / 2)) {
          direction = -1;
        }
        this.timeline.reset();
        this.timeline.start();

        let current = children[this.position];
        let last = children[this.lastPosition];
        let next = children[this.nextPosition];

        const currentStart = x - width * this.position;
        const lastStart = x - width * this.lastPosition - width;
        const nextStart = x - width * this.nextPosition + width;

        const template = value => `translateX(${value}px)`;
        const currentAnimation = new Animation(current.style, 'transform', currentStart, currentStart + (width * direction - x), 500, 0, ease, template);
        this.timeline.add(currentAnimation);
        if (x > 0) {
          const lastAnimation = new Animation(last.style, 'transform', lastStart, lastStart + (width * direction - x), 500, 0, ease, template);
          this.timeline.add(lastAnimation);          
        } else {
          const nextAnimation = new Animation(next.style, 'transform', nextStart, nextStart + (width * direction - x), 500, 0, ease, template);
          this.timeline.add(nextAnimation);
        }
   
        this.position = (this.position - direction + this.images.length) % this.images.length;
        this.nextPicTimer = setTimeout(nextPic, this.interval);
      }

      let element = <img src={url} enableGesture={true} onStart={onStart} onTap={onTap} onPan={onPan} onPanEnd={onPanEnd}/>;
      element.addEventListener('dragstart', event => event.preventDefault());
      return element;
    })

    let nextPic = () => {
      if (this.nextPicTimer) {
        clearTimeout(this.nextPicTimer);
      }
      if (this.timeline.state !== 'playing') {
        return;
      }
      let current = children[this.position];
      let next = children[this.nextPosition];

      const currentStart = -100 * this.position;
      const nextStart = -100 * (this.nextPosition - 1);

      current.style.transform = `translateX(${currentStart}%)`;
      next.style.transform = `translateX(${nextStart}%)`;

      this.nextPicTimer = setTimeout(() => {
        const currentAnimation = new Animation(current.style, 'transform', currentStart, currentStart - 100, 500, 0, ease, v => `translateX(${v}%)`);
        const nextAnimation = new Animation(next.style, 'transform', nextStart, nextStart - 100, 500, 0, ease, v => `translateX(${v}%)`);
        this.timeline.add(currentAnimation);
        this.timeline.add(nextAnimation);

        this.position = this.nextPosition;
      }, 16);

      this.nextPicTimer = setTimeout(nextPic, this.interval);
    }

    setTimeout(nextPic, this.interval);

    const carousel = <div class='carousel'>
      {children}
    </div>;

    return carousel;
  }
}
