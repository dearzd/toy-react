class TextWrapper {
  constructor(content) {
    this.type = 'text';
    this.root = document.createTextNode(content);
    this.props = Object.create(null);
    this.children = [];
    this.range = null;
    this.content = content;
  }

  mountTo(range) {
    this.range = range;
    range.deleteContents();
    range.insertNode(this.root);
  }

  get vdom() {
    return this;
  }
}

export default TextWrapper;