import React, { Component } from 'react';
import { Route, Switch, Redirect, NavLink, Link } from 'react-router-dom';
import { About } from './about';
import { Post } from './post';
import { Blog } from './blog';
import { ErrorView } from '../../components/error-view/error-view.component';
import './app.scene.scss';

const THEME_TYPES = {
    DEFAULT: 'app--default'
}

export class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            theme: THEME_TYPES.DEFAULT
        };
    }

    render() {
        return (
            <span className={this.state.theme}>
                <div className='container column'>
                    <header className="main__header">
                        <h1>blog-react</h1>
                    </header>
                    <nav>
                        <NavLink to={'/blog'} activeClassName={'nav-link--active'}>Blog</NavLink>
                        <NavLink to={'/about'} activeClassName={'nav-link--active'}>About</NavLink>
                    </nav>
                    <main>
                        <Switch>
                            <Route exact={true} path="/" render={() => <Redirect to={'./blog'}/>}/>
                            <Route exact={true} path="/home" render={() => <Redirect to={'./blog'}/>}/>
                            <Route exact={true} path="/blog" component={Blog}/>
                            <Route exact={true} path="/about" component={About}/>
                            <Route exact={true} path='/blog/posts/:postId' component={Post}/>
                            <Route render={(props) => <ErrorView error={{ message: `Oops! Could not find ${props.location.pathname}.` }}></ErrorView>} />
                        </Switch>
                    </main>
                    <hr className="main__footer-separator"/>
                    <footer className="main__footer">
                        <p>
                            Got any thoughts or questions? Contact the <Link to={'/about'}>author</Link>! |&nbsp;
                            <a href="https://github.com/jwango/blog-react"><img src="/GitHub-Mark-120px-plus.png" alt="github icon" className="main__footer-icon"></img> source code</a> |&nbsp;
                            <a href="/rss.xml"><img src="/rss-icon.png" alt="rss icon" className="main__footer-icon"></img> feed</a>
                        </p>
                    </footer>
                </div>
            </span>
        );
    }
}