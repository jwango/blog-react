import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import format from 'date-fns/format';
import parse from 'date-fns/parse';

export default class Time extends Component {

    today = new Date();

    static propTypes = {
        dateTime: PropTypes.string,
    };

    render() {
      if (this.props.dateTime) {
        const date = parse(this.props.dateTime);
        const dateFormat = date.getFullYear() === this.today.getFullYear() ? 'MMM D' : 'MMM D, YYYY';
        return <time dateTime={this.props.dateTime}>{format(date, dateFormat)}</time>;
      }
      return <Fragment></Fragment>;
    }
};