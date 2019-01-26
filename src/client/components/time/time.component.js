import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import format from 'date-fns/format';
import parse from 'date-fns/parse';

export class Time extends Component {

    static propTypes = {
        dateTime: PropTypes.string,
    };

    render() {
      if (this.props.dateTime) {
        return <time dateTime={this.props.dateTime}>{format(parse(this.props.dateTime), 'MMM D')}</time>;
      }
      return <Fragment></Fragment>;
    }
};