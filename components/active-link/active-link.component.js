import Link from 'next/link'
import { useRouter } from 'next/router'

function ActiveLink({ children, href, aliases, activeClassName, wrapAsLink = true }) {
  const router = useRouter();
  const hrefArr = [
    href,
    ...(aliases || [])
  ];
  const dynamicClassName = hrefArr.includes('/' + router.pathname.split('/')[1]) ? activeClassName : '';

  if (wrapAsLink) {
    return (
      <Link href={href}>
        <a className={dynamicClassName}>{children}</a>
      </Link>
    );
  } else {
    return (
      <a href={href} className={dynamicClassName}>{children}</a>
    );
  }
  
}

export default ActiveLink