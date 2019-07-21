import React, { Component } from 'react';
import './about.scene.scss';

export class About extends Component {
    render() {
        return (
            <article className="about">
                <h2>Hey!</h2>
                <p>My name is Josh Wang, and I am the author of the content of this website (and of the website itself). Though this started out as a pet project for learning React and Node tech, I am hoping for this to become an outlet of expression.</p>
                
                <section className="about__item">
                    <h3>Outward</h3>
                    <p>
                        <ul>
                            <li>People</li>
                            <li>Frontend Frameworks</li>
                            <li>Computer Aided Design</li>
                            <li>3D Printing</li>
                            <li>Sustainability</li>
                            <li>Basketball</li>
                            <li>Ultimate Frisbee and Disc Golf</li>
                        </ul>
                    </p>
                </section>

                <section className="about__item">
                    <h3>Inward</h3>
                    <p>
                        <details><summary>Click me?</summary>Don't know what you expected here, but try reading some of my blog posts!</details>
                    </p>
                </section>

                <section className="about__item">
                    <h3>Onward</h3>
                    <p>Please email me at <a href="mailto:joshua.wang.h@gmail.com">joshua.wang.h@gmail.com</a> if you have any questions or thoughts about this site!</p>
                </section>
            </article>
        );
    }
}