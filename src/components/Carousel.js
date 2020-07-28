import { createElement } from "../lib/createElement";
import { Timeline, Animation } from "../lib/animation";
import { cubicBezier } from "../lib/cubicBezier";

const ease = cubicBezier(.25, 1, .25, 1);
const linear = cubicBezier(0, 0, 1, 1);

export class Carousel {
  constructor(interval = 3000) {
    this.images = [];
    this.position = 0;
    this.timer = null;
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
        if (this.timer) {
          clearTimeout(this.timer);
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
        
        const dx = detail.clientX - detail.startX + offsetX;
        current.style.transform = `translateX(${dx - width * this.position}px)`;
        last.style.transform = `translateX(${dx - width * this.lastPosition - width}px)`;
        next.style.transform = `translateX(${dx - width * this.nextPosition + width}px)`;
      }

      const onPanEnd = ({ detail }) => {
        console.log('panend');
      }

      let element = <img src={url} enableGesture={true} onStart={() => onStart()} onTap={() => onTap()} onPan={e => onPan(e)} onPanEnd={(e) => onPanEnd(e)}/>;
      element.addEventListener('dragstart', event => event.preventDefault());
      return element;
    })

    let nextPic = () => {
      if (this.timer) {
        clearTimeout(this.timer);
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

      this.timer = setTimeout(() => {
        const a1 = new Animation(current.style, 'transform', currentStart, currentStart - 100, 5000, 0, ease, v => `translateX(${v}%)`);
        const a2 = new Animation(next.style, 'transform', nextStart, nextStart - 100, 5000, 0, ease, v => `translateX(${v}%)`);
        this.timeline.add(a1);
        this.timeline.add(a2);

        this.position = this.nextPosition;
      }, 16);

      this.timer = setTimeout(nextPic, this.interval);
    }

    setTimeout(nextPic, this.interval);

    const carousel = <div class='carousel'>
      {children}
    </div>;

    carousel.addEventListener('panend', e => {
      const width = carousel.root.getBoundingClientRect().width;
      const offsetX = e.detail.clientX - e.detail.startX;
      let offset = 0;

      if (e.detail.isFlick || offsetX > (width / 2)) {
        offset = 1;
      } else if (e.detail.isFlick || offsetX < -(width / 2)) {
        offset = -1;
      }

      let current = children[this.position];
      let last = children[this.lastPosition];
      let next = children[this.nextPosition];

      const currentStart = offsetX - width * this.position;
      const lastStart = offsetX - width * this.lastPosition - width;
      const nextStart = offsetX - width * this.nextPosition + width;
      let a1, a2;
      if (offsetX > 0) {
        // last & current
        if (offset) {
          a1 = new Animation(current.style, 'transform', currentStart, currentStart + (width - offsetX), 500, 0, ease, v => `translateX(${v}px)`);
          a2 = new Animation(last.style, 'transform', lastStart, lastStart + (width - offsetX), 500, 0, ease, v => `translateX(${v}px)`);
        } else {
          a1 = new Animation(current.style, 'transform', currentStart, currentStart - offsetX, 500, 0, ease, v => `translateX(${v}px)`);
          a2 = new Animation(last.style, 'transform', lastStart, lastStart - offsetX, 500, 0, ease, v => `translateX(${v}px)`);
        }
      } else {
        // current & next
        if (offset) {
          a1 = new Animation(current.style, 'transform', currentStart, currentStart - (width + offsetX), 500, 0, ease, v => `translateX(${v}px)`);
          a2 = new Animation(next.style, 'transform', nextStart, nextStart - (width + offsetX), 500, 0, ease, v => `translateX(${v}px)`);
        } else {
          a1 = new Animation(current.style, 'transform', currentStart, currentStart - offsetX, 500, 0, ease, v => `translateX(${v}px)`);
          a2 = new Animation(next.style, 'transform', nextStart, nextStart - offsetX, 500, 0, ease, v => `translateX(${v}px)`);
        }
      }
      this.timeline.clear();
      this.timeline.add(a1);
      this.timeline.add(a2);
      this.timeline.start();

      this.position = (this.position - offset + this.images.length) % this.images.length;
      this.timer = setTimeout(nextPic, this.interval);
    })

    return carousel;
  }
}
