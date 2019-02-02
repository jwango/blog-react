import React, { Component } from 'react';
import PropTypes from 'prop-types';

export class CommentForm extends Component {

  static propTypes = {
    viewIndex: PropTypes.number,
    previewIndex: PropTypes.number,
    setActive: PropTypes.func,
    updatePayload: PropTypes.func
  };

  constructor(props) {
    super(props);
    this.state = {
      body: ''
    };
  }

  onPreview() {
    this.props.updatePayload(this.state.body);
    this.props.setActive(this.props.previewIndex);
  }

  handleChange(event) {
    this.setState({
      body: event.target.value
    });
  }


  render() {
    return (
      <div className="comment__form">
        <textarea value={this.state.body} onChange={this.handleChange.bind(this)}></textarea>
        <div class="comment__actions">
          <button type="submit">Submit</button>
          <button type="button" onClick={this.onPreview.bind(this)}>Preview</button>
        </div>
      </div>
    )
  }
}