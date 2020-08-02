import { createElement } from "../lib/createElement";

export class TabPanel {
  constructor() {
    this.children = [];
    this.bodyContents = ''
    this.headerTitles = ''
  }

  setAttribute(name, value) {
    this[name] = value;
  }

  appendChild(child) {
    this.children.push(child)
  }

  select(i) {
    for (const c of this.bodyContents) {
      c.style.display = 'none'
    }
    this.bodyContents[i].style.display = ''
  }

  render() {
    this.headerTitles = this.children.map((c, i) => <span class="title" onClick={() => this.select(i)}>{c.title}</span>)
    this.bodyContents = this.children.map(c => <div class="content">{c}</div>)
    setTimeout(() => {
      this.select(0)
    });
    return <div class="tab-panel">
      <h1 class="tab-panel-header">
        {this.headerTitles}
      </h1>
      <div class="tab-panel-body">
        {this.bodyContents}
      </div>
    </div>
  }
}