import React, { Component } from 'react';
import PropTypes from 'prop-types';

export class MultiView extends Component {
  static propTypes = {
    views: PropTypes.arrayOf(PropTypes.element),
    start: PropTypes.number
  }

  constructor(props) {
    super(props);
    this.state = {
      active: this.validIndex(props.start)
    };
  }

  validIndex(index) {
    return Math.min(Math.max(index || 0, 0), this.props.views.length - 1);
  }

  setActive(index) {
    this.setState({
      active: this.validIndex(index)
    });
  }

  renderViews(views, index) {
    return views.map((view, i) => {
      var classes = 'multi-view__view';
      if (i === index) {
        classes += ' multi-view--active';
      }
      return (
        <section className={classes} key={i}>
          { React.cloneElement(view, { setActive: this.setActive.bind(this), viewIndex: i }) }
        </section>
      );
    });
  }

  render() {
    return (
      <div className="multi-view">{this.renderViews(this.props.views, this.state.active)}</div>
    );
  }
}