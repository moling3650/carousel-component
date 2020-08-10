import { createElement } from "./lib/createElement";
import { Carousel } from "./components/Carousel";
import { Panel } from "./components/Panel";
import { TabPanel } from "./components/TabPanel";
import { ListView } from "./components/ListView";

const carousel = <Carousel images={[
  'https://static001.geekbang.org/resource/image/bb/21/bb38fb7c1073eaee1755f81131f11d21.jpg',
  'https://static001.geekbang.org/resource/image/1b/21/1b809d9a2bdf3ecc481322d7c9223c21.jpg',
  'https://static001.geekbang.org/resource/image/b6/4f/b6d65b2f12646a9fd6b8cb2b020d754f.jpg',
  'https://static001.geekbang.org/resource/image/73/e4/730ea9c393def7975deceb48b3eb6fe4.jpg',
]} />;

carousel.render().mountTo(document.getElementById('container'));

// const panel = <Panel title="panel title">
//   <span>This is content.</span>
// </Panel>

// panel.render().mountTo(document.getElementById('container'));

// const tabPanel = <TabPanel title="panel title">
//   <span title="title1">This is content 1.</span>
//   <span title="title2">This is content 2.</span>
//   </TabPanel>

// tabPanel.render().mountTo(document.getElementById('container'));

// window.tp = tabPanel

// const data = [
//   { title: '蓝猫', url: 'https://static001.geekbang.org/resource/image/bb/21/bb38fb7c1073eaee1755f81131f11d21.jpg' },
//   { title: '猫2', url: 'https://static001.geekbang.org/resource/image/1b/21/1b809d9a2bdf3ecc481322d7c9223c21.jpg' },
//   { title: '猫3', url: 'https://static001.geekbang.org/resource/image/b6/4f/b6d65b2f12646a9fd6b8cb2b020d754f.jpg' },
//   { title: '猫4', url: 'https://static001.geekbang.org/resource/image/73/e4/730ea9c393def7975deceb48b3eb6fe4.jpg' },
// ]

// const listView = <ListView data={data}>
// {
//   record => <figure>
//     <img src={record.url} />
//     <figcaption>{record.title}</figcaption>
//   </figure>
// }
// </ListView>

// listView.render().mountTo(document.getElementById('container'));
