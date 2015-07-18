var ____Class2=React.Component;for(var ____Class2____Key in ____Class2){if(____Class2.hasOwnProperty(____Class2____Key)){Highlight[____Class2____Key]=____Class2[____Class2____Key];}}var ____SuperProtoOf____Class2=____Class2===null?null:____Class2.prototype;Highlight.prototype=Object.create(____SuperProtoOf____Class2);Highlight.prototype.constructor=Highlight;Highlight.__superConstructor__=____Class2;
  function Highlight(props) {"use strict";
    ____Class2.call(this,props);
  }

  Object.defineProperty(Highlight.prototype,"componentDidMount",{writable:true,configurable:true,value:function() {"use strict";
    this.SetHighlight();
  }});

  Object.defineProperty(Highlight.prototype,"componentDidUpdate",{writable:true,configurable:true,value:function() {"use strict";
    this.SetHighlight();
  }});

  Object.defineProperty(Highlight.prototype,"SetHighlight",{writable:true,configurable:true,value:function() {"use strict";
    var domNode = React.findDOMNode(this);
    var nodes = domNode.querySelectorAll('pre code');

    if (nodes.length > 0) {
      for (var i = 0, len = nodes.length; i < len; i++) {
        hljs.highlightBlock(nodes[i]);
      }
    }
  }});

  Object.defineProperty(Highlight.prototype,"render",{writable:true,configurable:true,value:function() {"use strict";
    if (this.props.innerHTML) {
      return (
        React.createElement("div", {dangerouslySetInnerHTML: {__html: this.props.children}, className: this.props.className || null})
      )
    } else {
      return (
        React.createElement("pre", {style: {padding: 0, margin: 0, wordWrap: 'normal'}}, 
          React.createElement("code", {className: this.props.className, style: {whiteSpace: 'inherit'}}, this.props.children)
        )
      )
    }
  }});


Highlight.propTypes = {
  innerHTML: React.PropTypes.bool,
  className: React.PropTypes.string,
}

Highlight.defaultProps = {
  innerHTML: false,
  className: '',
}