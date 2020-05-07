import Link from 'next/link'
import { useRouter } from 'next/router'

function ActiveLink({ children, href, activeClassName }) {
  const router = useRouter()
  const dynamicClassName = router.pathname === href ? activeClassName : '';

  const handleClick = e => {
    e.preventDefault()
    router.push(href)
  }

  return (
    <Link href={href}>
      <a onClick={handleClick} className={dynamicClassName}>
        {children}
      </a>
    </Link>
  )
}

export default ActiveLink