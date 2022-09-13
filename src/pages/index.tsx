/* eslint-disable jsx-a11y/anchor-is-valid */
import { GetStaticProps } from 'next';

import { FiUser, FiCalendar } from 'react-icons/fi';
import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home() {
  return (
    <main className={styles.conteiner}>
      <div className={styles.post}>
        <a href="#">
          <strong>
            Lorem ipsum dolor, sit amet consectetur adipisicing elit.
          </strong>
          <p className={styles.content}>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Qui
            architecto saepe asperiores eveniet.
          </p>
          <div className={styles.info}>
            <FiCalendar />
            <time>13 Set 2022</time>
            <FiUser />
            <p>José Cardoso</p>
          </div>
        </a>
      </div>
    </main>
  );
}

// export const getStaticProps = async () => {
//   // const prismic = getPrismicClient({});
//   // const postsResponse = await prismic.getByType(TODO);

//   // TODO
// };
