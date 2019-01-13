import React, { Component } from 'react';
import { Feed } from '../../../components/feed/feed.component';

export class Blog extends Component {
    render() {
        return <Feed batchSize={2}/>;
    }
}