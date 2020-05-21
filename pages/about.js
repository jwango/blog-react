import HeadCustom from '../components/head-custom/head-custom.component';
import styles from './about.module.scss';

function About({ publicUrl }) {
  return (<>
    <HeadCustom
      title='about'
      description='built by github/jwango'
      keywords='blog, react, framework, about, jwango'
      baseUrl={publicUrl}
      relUrl='/about'>
    </HeadCustom>
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

export async function getStaticProps() {
    return { props: { publicUrl: process.env.PUBLIC_URL } }
}

export default About;