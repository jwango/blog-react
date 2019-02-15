import React, { Component } from 'react';
import { Route, Switch, Redirect, NavLink, Link } from 'react-router-dom';
import { Home } from './home';
import { About } from './about';
import { Post } from './post';
import { Archive } from './archive';
import { ErrorView } from '../../components/error-view/error-view.component';
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
            <span className={this.state.theme}>
                <div className='container column'>
                    <header className="main__header">
                        <h1>andful</h1>
                    </header>
                    <nav>
                        <NavLink to={'/home'} activeClassName={'nav-link--active'}>Home</NavLink>
                        <NavLink to={'/about'} activeClassName={'nav-link--active'}>About</NavLink>
                        <NavLink to={'/archive'} activeClassName={'nav-link--active'}>Archive</NavLink>
                    </nav>
                    <main>
                        <Switch>
                            <Route exact={true} path="/" render={() => <Redirect to={'./home'}/>}/>
                            <Route exact={true} path="/home" component={Home}/>
                            <Route exact={true} path="/about" component={About}/>
                            <Route exact={true} path="/archive" component={Archive}/>
                            <Route exact={true} path='/blog/posts/:postId' component={Post}/>
                            <Route render={(props) => <ErrorView error={{ message: `Oops! Could not find ${props.location.pathname}.` }}></ErrorView>} />
                        </Switch>
                    </main>
                    <hr className="main__footer-separator"/>
                    <footer className="main__footer">
                        <p>Got any thoughts or questions? Contact the <Link to={'/about'}>author</Link>! | <a href="https://github.com/jwango/andful"><img src="/GitHub-Mark-120px-plus.png" className="main__footer-icon"></img> source code</a></p>
                    </footer>
                </div>
            </span>
        );
    }
}