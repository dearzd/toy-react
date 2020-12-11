import Component from './component';
import ElementWrapper from './elementWrapper';
import TextWrapper from './textWrapper';

function createElement(type, attributes, ...children) {
  let element;

  if (typeof type === 'string') {
    element = new ElementWrapper(type);
  } else {
    element = new type();
  }

  for (let name in attributes) {
    element.setAttribute(name, attributes[name]);
  }

  let insertChildren = (children) => {
    for (let child of children) {
      if (Array.isArray(child)) {
        insertChildren(child);
      } else {
        // console.log(child);
        if (child === null || child === undefined) {
          child = '';
        }
        if (typeof child === 'string') {
          child = new TextWrapper(child);
        }
        element.appendChild(child);
      }
    }
  };

  insertChildren(children);

  // console.log(element);

  return element;
}

function render(element, container) {
  console.log('render', container);
  let range = document.createRange();
  range.setStart(container, 0);
  range.setEnd(container, 0);
  element.mountTo(range);
}

const ToyReact = {
  createElement,
  render,
  Component
};

export default ToyReact;
export {
  createElement,
  render,
  Component
};