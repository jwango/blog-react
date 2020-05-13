import App from 'next/app';
import Head from 'next/head';
import Link from 'next/link';

import ActiveLink from '../components/active-link/active-link.component';

import '../styles/sass/main.scss';
import './_app.scss';

const THEME_TYPES = {
    DEFAULT: 'app--default',
    DARK: 'app--dark'
}

export default class MyApp extends App {

    constructor(props) {
        super(props);
        this.state = {
            theme: THEME_TYPES.DEFAULT
        };
    }

    render() {
        const Component = this.props.Component;
        const pageProps = this.props.pageProps;
        return (
            <span className={this.state.theme}>
                <Head>
                    <title>blog-react</title>
                </Head>
                <div className='container column'>
                    <header className='main__header'>
                        <div className='content-wrapper'>
                            <h1>blog-react</h1>
                        </div>
                    </header>
                    <nav>
                        <div className='content-wrapper'>
                            <ActiveLink href='/' aliases={['/posts']} activeClassName='nav-link--active' wrapAsLink={false}>Blog</ActiveLink>
                            <ActiveLink href='/about' activeClassName='nav-link--active'>About</ActiveLink>
                        </div>
                    </nav>

                    <main className='content-wrapper'><Component {...pageProps} /></main>

                    <hr className='content-wrapper'/>
                    <footer className='main__footer content-wrapper'>
                        <p>
                            Got any thoughts or questions? Contact the <Link href='/about'><a>author</a></Link>! |&nbsp;
                            <a href='https://github.com/jwango/blog-react' target='_blank'><img src='/GitHub-Mark-120px-plus.png' alt='github icon' className='main__footer-icon'></img> source code</a> |&nbsp;
                            <a href='/rss.xml' target='_blank'><img src='/rss-icon.png' alt='rss icon' className='main__footer-icon'></img> feed</a>&nbsp;
                            Icons powered by <a href='https://fontawesome.com/license' target='_blank'>Font Awesome</a>.
                        </p>
                    </footer>
                </div>
            </span>
        );
    }
}