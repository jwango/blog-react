import React, { Component } from 'react';
import Head from 'next/head'
import styles from './about.module.scss';

export default class About extends Component {
    render() {
        return (<>
            <Head>
                <title>About</title>
            </Head>
            <article className={styles['about']}>
                <header className={styles['about--wide']}>
                    <h2>Hey!</h2>
                    <p>Welcome to the about section.</p>
                </header>
                
                <section className={styles['about__item']}>
                    <h3>Column 1</h3>
                    <ul>
                        <li>Item 1</li>
                        <li>Item 2</li>
                        <li>Item 3</li>
                        <li>Item 4</li>
                        <li>Item 5</li>
                        <li>Item 6</li>
                        <li>Item 7</li>
                    </ul>
                </section>

                <section className={styles['about__item']}>
                    <h3>Column 2</h3>
                    <details><summary>Click me?</summary>Boo!</details>
                </section>

                <section className={styles['about__item']}>
                    <h3>Column 3</h3>
                    <p>Share some contact information.</p>
                </section>
            </article>
        </>);
    }
}