import App from 'next/app';
import Link from 'next/link';
import ActiveLink from '../components/active-link/active-link.component';

import '../styles/sass/main.scss';
import './_app.scss';

const THEME_TYPES = {
    DEFAULT: 'app--default'
}

process.env.PUBLIC_URL = process.env.PUBLIC_URL || "http://localhost:3000";
process.env.DISQUS_URL = process.env.DISQUS_URL;

export default class MyApp extends App {

    constructor(props) {
        super(props);
        this.state = {
            theme: THEME_TYPES.DEFAULT
        };
    }

    componentDidMount() {
        window.__GATEWAY_URL__ = process.env.PUBLIC_URL;
        window.__DISQUS_URL__ = process.env.DISQUS_URL;
    }

    render() {
        const Component = this.props.Component;
        const pageProps = this.props.pageProps;
        return (
            <span className={this.state.theme}>
                <div className='container column'>
                    <header className="main__header">
                        <h1>blog-react</h1>
                    </header>
                    <nav>
                        <ActiveLink href={'/'} activeClassName={'nav-link--active'}>Blog</ActiveLink>
                        <ActiveLink href={'/about'} activeClassName={'nav-link--active'}>About</ActiveLink>
                    </nav>

                    <main><Component {...pageProps} /></main>

                    <hr className="main__footer-separator"/>
                    <footer className="main__footer">
                        <p>
                            Got any thoughts or questions? Contact the <Link href={'/about'}><a>author</a></Link>! |&nbsp;
                            <a href="https://github.com/jwango/blog-react"><img src="/GitHub-Mark-120px-plus.png" alt="github icon" className="main__footer-icon"></img> source code</a> |&nbsp;
                            <a href="/rss.xml"><img src="/rss-icon.png" alt="rss icon" className="main__footer-icon"></img> feed</a>
                        </p>
                    </footer>
                </div>
            </span>
        );
    }
}