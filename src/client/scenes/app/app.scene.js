import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Redirect, Link } from 'react-router-dom';
import { Home } from './home';
import { About } from './about';
import { Blog, Post } from './blog';
import './app.scene.scss';

const SCENE_TYPES = {
    HOME: 0,
    ABOUT: 1
};

const THEME_TYPES = {
    DEFAULT: 'app--default'
}

export class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            currentScene: SCENE_TYPES.HOME,
            theme: THEME_TYPES.DEFAULT
        };
    }

    updateCurrentScene(scene) {
        this.setState({
            currentScene: scene
        });
    }

    renderCurrentScene() {
        if (this.state.currentScene === SCENE_TYPES.ABOUT) {
            return <About/>;
        }
        return <Home/>;
    }

    render() {
        return (
            <Router>
                <span className={this.state.theme}>
                    <div className='container column'>
                        <header className="main__header">
                            <h1>Meshi</h1>
                        </header>
                        <nav>
                            <Link to={'/home'}>Home</Link>
                            <Link to={'/about'}>About</Link>
                            <Link to={'/blog'}>Blog</Link>
                        </nav>
                        <main>
                            <Route exact={true} path="/" render={() => <Redirect to={'/home'}/>}/>
                            <Route exact={true} path="/home" component={Home}/>
                            <Route exact={true} path="/about" component={About}/>
                            <Route exact={true} path="/blog" component={Blog}/>
                            <Route path='/blog/posts/:postId' component={Post}/>
                        </main>
                        <hr className="main__footer-separator"/>
                        <footer className="main__footer">
                            Footer
                        </footer>
                    </div>
                </span>
            </Router>
        );
    }
}