import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';

export class Comment extends PureComponent {

  static propTypes = {
    guid: PropTypes.string,
    renderDepth: PropTypes.number,
    getDataFunc: PropTypes.func
  };

  intialExpanded;

  constructor(props) {
    super(props);
    this.initialExpanded = this.props.renderDepth > 0;
    this.state = {
      user: '',
      body: '',
      pubDate: undefined,
      children: [],
      firstExpanded: this.initialExpanded,
      loading: this.initialExpanded,
      error: undefined
    };
  }

  componentDidMount() {
    if (!this.props.staticContext) {
      this.getData();
    }
  }

  getData() {
    this.setState({ error: undefined, loading: true });
    var minTimePromise = new Promise((resolve, reject) => {
        setTimeout((callback) => { callback(); }, 500, resolve);
    });
    Promise.all([this.props.getDataFunc(this.props.guid), minTimePromise])
      .then((res) => res[0])
      .then((res) => {
        this.setState({
          user: res.user,
          body: res.body,
          pubDate: res.pubDate,
          children: res.children,
          loading: false
        });
      }, (err) => {
        this.setState({
          error: err
        });
      });
  }

  handleExpand() {
    if (!this.state.firstExpanded) {
      this.setState({
        firstExpanded: true
      });
    }
  }

  renderChildren(children) {
    var self = this;
    return children.map((child) => {
      return <Comment guid={child} getDataFunc={self.props.getDataFunc} renderDepth={Math.max(this.props.renderDepth - 1, 0)}></Comment>
    });
  }

  renderDetails(children) {
    if (children) {
      return (
        <details open={this.initialExpanded}>
          <summary onClick={() => this.handleExpand()}>{children.length} response(s)</summary>
          <ul>
            { this.state.firstExpanded ? this.renderChildren(children) : <Fragment></Fragment> }
          </ul>
        </details>
      );
    }
    return <Fragment></Fragment>;
  }

  renderError(error) {
    return <p>{error.message}</p>;
  }

  renderLoading() {
    return <Fragment>Loading</Fragment>;
  }

  render() {
    var innerContent = <Fragment></Fragment>;
    var outerContent = <Fragment></Fragment>;
    if (this.state.error) { innerContent = this.renderError(this.state.error); }
    else if (this.state.loading) { innerContent = this.renderLoading(); }
    else {
      innerContent = (
        <Fragment>
          <h4>{this.state.user}</h4>
          <p>{this.state.body}</p>
          <div className="comment__reactions"><button>REPLY</button></div>
        </Fragment>
      );
      outerContent = this.renderDetails(this.state.children);
    }
    return (
      <li className="comment" id={`comment-${this.props.guid}`}><div class="comment__content">{ innerContent }</div>{ outerContent }</li>
    );
  }

}