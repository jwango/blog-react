import React, { Component } from 'react';
import PropTypes from 'prop-types';

export class Tag extends Component {

    static propTypes = {
        name: PropTypes.string,
        link: PropTypes.string
    };

    constructor(props) {
        super(props);
        this.state = {
            name: props.name ? props.name : '',
            link: props.link ? props.link : '#'
        };
    }

    render() {
        return <a className="tag" href={this.state.link}>{this.state.name}</a>;
    }
};