
import { useRouter } from 'next/router';
import Link from "next/link";
import styles from './header.module.scss';

export default function Header() {
  const router = useRouter();

  return (
    <header className={styles.headerContainer}>
      <div className={styles.headerContent}>
        <Link href={'/'}>
        <img src="/Logo.svg" alt="logo"/>
        </Link>
      </div>
    </header>
  );
}
