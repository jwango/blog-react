import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

export class ErrorView extends Component {

    static propTypes = {
        error: PropTypes.object,
    };

    render() {
      if (this.props.error) {
        return <h4><span className="fas fa-exclamation-triangle"></span>{this.props.error.message}</h4>;
      }
      return <Fragment></Fragment>;
    }
};