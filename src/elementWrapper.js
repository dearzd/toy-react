class ElementWrapper {
  constructor(type) {
    this.type = type;
    this.props = Object.create(null);
    this.children = [];
    this.range = null;
    this.rdom = null;
  }

  setAttribute(name, value) {
    this.props[name] = value;
  }

  appendChild(child) {
    this.children.push(child.vdom);
  }

  mountTo(range) {
    this.range = range;
    range.deleteContents();
    let element = document.createElement(this.type);

    for (let name in this.props) {
      const value = this.props[name];

      if (name === 'key') {
        continue;
      }

      // Handle event
      if (name.match(/^on([\s\S]+)$/)) {
        const eventName = RegExp.$1.replace(/^[\s\S]/, (s) => s.toLowerCase());
        element.addEventListener(eventName, value);
        continue;
      }

      // Handle attribute
      if (name === 'className') {
        name = 'class';
      }
      element.setAttribute(name, value);
    }

    // For vdom test
    element.setAttribute('timestamp', Date.now());

    for (let child of this.children) {
      let childRange = document.createRange();
      if (element.children.length) {
        childRange.setStartAfter(element.lastChild);
        childRange.setEndAfter(element.lastChild);
      } else {
        childRange.setStart(element, 0);
        childRange.setEnd(element, 0);
      }
      child.mountTo(childRange);
    }

    range.insertNode(element);
    this.rdom = element;
  }

  get vdom() {
    return this;
  }
}

export default ElementWrapper;