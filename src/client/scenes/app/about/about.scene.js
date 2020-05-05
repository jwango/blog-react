import React, { Component } from 'react';
import './about.scene.scss';

export class About extends Component {
    render() {
        return (
            <article className="about">
                <header className="about--wide">
                    <h2>Hey!</h2>
                    <p>Welcome to the about section.</p>
                </header>
                
                <section className="about__item">
                    <h3>Column 1</h3>
                    <p>
                        <ul>
                            <li>Item 1</li>
                            <li>Item 2</li>
                            <li>Item 3</li>
                            <li>Item 4</li>
                            <li>Item 5</li>
                            <li>Item 6</li>
                            <li>Item 7</li>
                        </ul>
                    </p>
                </section>

                <section className="about__item">
                    <h3>Column 2</h3>
                    <p>
                        <details><summary>Click me?</summary>Boo!</details>
                    </p>
                </section>

                <section className="about__item">
                    <h3>Column 3</h3>
                    <p>Share some contact information.</p>
                </section>
            </article>
        );
    }
}