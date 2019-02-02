import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { MdFragment } from '../../md-fragment';
import parseMarkdown from '../../../utils/parse.util';

export class CommentContent extends PureComponent {

  static propTypes = {
    user: PropTypes.string,
    body: PropTypes.string
  }

  render() {
    return (
      <div className="comment__content">
        <h4>{this.props.user}</h4>
        <MdFragment chunks={parseMarkdown(this.props.body.split('\n'))}></MdFragment>
        <div className="comment__actions">{this.props.children}</div>
      </div>
    );
  }
}