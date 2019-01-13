import React, { Component } from 'react';
import { Feed } from '../../../components/feed/feed.component';

export class Home extends Component {
  render() {
    return (
      <Feed batchSize={2}/>
    );
  }
}
