import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import './index.scss';
import { App } from './scenes/app/app.scene';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.hydrate((
    <BrowserRouter>
        <App/>
    </BrowserRouter>
), document.getElementById('root'));
registerServiceWorker();
