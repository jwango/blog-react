import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import Icon, { IconNames } from '../icon/icon.component';

export default class ErrorView extends Component {

    static propTypes = {
        error: PropTypes.object,
    };

    render() {
      if (this.props.error) {
        return <h4><Icon name={IconNames.EXCLAMATION_TRIANGLE} baseline={true}></Icon>&nbsp;{this.props.error.message}</h4>;
      }
      return <Fragment></Fragment>;
    }
};