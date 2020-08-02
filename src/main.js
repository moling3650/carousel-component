import { createElement } from "./lib/createElement";
// import { Carousel } from "./components/Carousel";
import { Panel } from "./components/Panel";
import { TabPanel } from "./components/TabPanel";

// const carousel = <Carousel images={[
//   'https://static001.geekbang.org/resource/image/bb/21/bb38fb7c1073eaee1755f81131f11d21.jpg',
//   'https://static001.geekbang.org/resource/image/1b/21/1b809d9a2bdf3ecc481322d7c9223c21.jpg',
//   'https://static001.geekbang.org/resource/image/b6/4f/b6d65b2f12646a9fd6b8cb2b020d754f.jpg',
//   'https://static001.geekbang.org/resource/image/73/e4/730ea9c393def7975deceb48b3eb6fe4.jpg',
// ]} />;

// carousel.render().mountTo(document.getElementById('container'));

// const panel = <Panel title="panel title">
//   <span>This is content.</span>
// </Panel>

// panel.render().mountTo(document.getElementById('container'));

const tabPanel = <TabPanel title="panel title">
  <span title="title1">This is content 1.</span>
  <span title="title2">This is content 2.</span>
  </TabPanel>

tabPanel.render().mountTo(document.getElementById('container'));

window.tp = tabPanel