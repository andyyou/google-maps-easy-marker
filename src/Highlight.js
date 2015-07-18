class Highlight extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.SetHighlight();
  }

  componentDidUpdate() {
    this.SetHighlight();
  }

  SetHighlight() {
    var domNode = React.findDOMNode(this);
    var nodes = domNode.querySelectorAll('pre code');

    if (nodes.length > 0) {
      for (var i = 0, len = nodes.length; i < len; i++) {
        hljs.highlightBlock(nodes[i]);
      }
    }
  }

  render() {
    if (this.props.innerHTML) {
      return (
        <div dangerouslySetInnerHTML={{__html: this.props.children}} className={this.props.className || null}></div>
      )
    } else {
      return (
        <pre style={{padding: 0, margin: 0, wordWrap: 'normal'}}>
          <code className={this.props.className} style={{whiteSpace: 'inherit'}}>{this.props.children}</code>
        </pre>
      )
    }
  }
}

Highlight.propTypes = {
  innerHTML: React.PropTypes.bool,
  className: React.PropTypes.string,
}

Highlight.defaultProps = {
  innerHTML: false,
  className: '',
}