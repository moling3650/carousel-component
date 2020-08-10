const css = require('css');

module.exports = function (source) {
  const style = css.parse(source);
  const name = this.resourcePath.match(/([^\\/]+)\.css$/)[1];
  
  for (const rule of style.stylesheet.rules) {
    rule.selectors = rule.selectors.map(selector => {
      if (!selector.startsWith(`.${name}`)) {
        selector = `.${name} ${selector}`;
      }
      return selector;
    });
  }
  return `
  const style = document.createElement("STYLE");
  style.innerHTML = ${JSON.stringify(css.stringify(style))};
  document.documentElement.appendChild(style);
  `
}