class Component {
  constructor() {
    console.log('constructor', this);
    this.range = null;
    this.props = Object.create(null);
    this.children = [];
  }

  setAttribute(name, value) {
    this.props[name] = value;
  }

  appendChild(child) {
    this.children.push(child.vdom);
  }

  mountTo(range) {
    console.log('mount to', this);
    this.range = range;
    return this.update();
  }

  get vdom() {
    return this.render().vdom;
  }

  setState(partialState) {
    const merge = (oldState, newState) => {
      for (let name in newState) {
        if (typeof newState[name] === 'object' && newState[name] !== null) {
          if (typeof oldState[name] !== 'object') {
            if (newState[name] instanceof Array) {
              oldState[name] = [];
            } else {
              oldState[name] = {};
            }
          }
          merge(oldState[name], newState[name]);
        }
        oldState[name] = newState[name];
      }
    };

    if (!this.state && partialState) {
      this.state = {};
    }

    merge(this.state, partialState);

    this.update();
  }

  update() {
    let vdom = this.vdom;
    if (this.oldVdom) {
      const isSameNode = (oldNode, newNode) => {
        newNode.range = oldNode.range;
        newNode.rdom = oldNode.rdom;

        if (oldNode.type !== newNode.type) {
          return false;
        }

        if (oldNode.type === 'text' && newNode.type === 'text') {
          return oldNode.content === newNode.content;
        }

        if (Object.keys(oldNode.props).length !== Object.keys(newNode.props).length) {
          return false;
        }

        for (let name in oldNode.props) {
          if (
            typeof oldNode.props[name] === 'function' &&
            typeof newNode.props[name] === 'function' &&
            oldNode.props[name].toString() === newNode.props[name].toString()
          ) {
            continue;
          }

          if (oldNode.props[name] !== newNode.props[name]) {
            return false;
          }
        }

        return true;
      };

      const isSameTree = (oldTree, newTree) => {
        if (!isSameNode(oldTree, newTree)) {
          return false;
        }

        if (oldTree.children.length !== newTree.children.length) {
          return false;
        }

        for (let i = 0; i < oldTree.children.length; i++) {
          if (!isSameTree(oldTree.children[i], newTree.children[i])) {
            return false;
          }
        }

        return true;
      };

      const replace = (oldTree, newTree) => {
        if (isSameTree(oldTree, newTree)) {
          console.log('all same');
          return;
        }

        if (!isSameNode(oldTree, newTree)) {
          console.log('node different', oldTree, newTree);
          newTree.mountTo(oldTree.range);
        } else {
          let i = 0;
          for (; i < oldTree.children.length; i++) {
            if (newTree.children[i]) {
              replace(oldTree.children[i], newTree.children[i]);
            } else {
              // Delete from tree
              oldTree.children[i].range.deleteContents();
            }
          }

          if (newTree.children.length > i) {
            // Other new tree node
            for (let j = i; j < newTree.children.length; j++) {
              let childRange = document.createRange();
              if (oldTree.rdom.children.length) {
                childRange.setStartAfter(oldTree.rdom.lastChild);
                childRange.setEndAfter(oldTree.rdom.lastChild);
              } else {
                childRange.setStart(oldTree.rdom, 0);
                childRange.setEnd(oldTree.rdom, 0);
              }
              newTree.children[j].mountTo(childRange);
            }
          }
        }
      };

      console.log(this.oldVdom);
      console.log(vdom);
      replace(this.oldVdom, vdom);
    } else {
      vdom.mountTo(this.range);
    }

    this.oldVdom = vdom;
  }
}

export default Component;