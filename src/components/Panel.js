import { createElement } from "../lib/createElement";

export class Panel {
  constructor() {
    this.children = []
  }

  setAttribute(name, value) {
    this[name] = value;
  }

  appendChild(child) {
    this.children.push(child)
  }

  render() {
    return <div class="panel">
      <h1 class="panel-title">{this.title}</h1>  
      <div class="panel-body">
        {this.children}
      </div>
    </div>
  }
}