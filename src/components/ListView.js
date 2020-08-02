import { createElement } from "../lib/createElement";

export class ListView {
  constructor() {
    this.children = [];
  }

  setAttribute(name, value) {
    this[name] = value;
  }

  appendChild(child) {
    this.children.push(child)
  }

  render() {
    return <div class="list-view">
      {this.data.map(this.children[0])}
    </div>
  }
}