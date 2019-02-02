import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { CommentContent } from '../../../../components/comment/comment-content/comment-content.component';

export class CommentPreview extends Component {

  static propTypes = {
    viewIndex: PropTypes.number,
    editIndex: PropTypes.number,
    setActive: PropTypes.func,
    body: PropTypes.string
  };

  constructor(props) {
    super(props);
  }

  onEdit() {
    this.props.setActive(this.props.editIndex);
  }

  render() {
    return (
      <div className="comment__preview">
          <CommentContent user={"Preview User"} body={this.props.body}>
            <button type="submit">Submit</button>
            <button type="button" onClick={this.onEdit.bind(this)}>Edit</button>
          </CommentContent>
      </div>
    );
  }
}