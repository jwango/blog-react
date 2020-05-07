import Link from 'next/link'
import { useRouter } from 'next/router'

function ActiveLink({ children, href, aliases, activeClassName }) {
  const router = useRouter();
  const hrefArr = [
    href,
    ...(aliases || [])
  ];
  const dynamicClassName = hrefArr.includes('/' + router.pathname.split('/')[1]) ? activeClassName : '';

  const handleClick = e => {
    e.preventDefault()
    router.push(href)
  };

  return (
    <Link href={href}>
      <a onClick={handleClick} className={dynamicClassName}>
        {children}
      </a>
    </Link>
  );
}

export default ActiveLink