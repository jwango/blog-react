import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

export default class Tag extends Component {

    static propTypes = {
        link: PropTypes.string
    };

    constructor(props) {
        super(props);
    }

    showLink() {
        return this.props.link;
    }

    renderInner() {
        if (this.showLink()) {
            return <a href={this.props.link}>{this.props.children}</a>;
        }
        return <Fragment>{this.props.children}</Fragment>;
    }

    render() {
        let classes = "tag";
        if (this.showLink()) {
            classes += " tag--linkable";
        }
        return <span className={classes}>{this.renderInner()}</span>
    }
};