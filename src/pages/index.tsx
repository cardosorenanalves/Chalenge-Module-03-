/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable jsx-a11y/anchor-is-valid */
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { GetStaticProps } from 'next';

import { FiUser, FiCalendar } from 'react-icons/fi';
import { getPrismicClient } from '../services/prismic';

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

export default function Home({ postsPagination }: HomeProps) {
  return (
    <main className={styles.conteiner}>
      <div className={styles.post}>
        {postsPagination.results.map(post => (
          <a key={post.uid} href="#">
            <strong>{post.data.title}</strong>
            <p className={styles.content}>{post.data.subtitle}</p>
            <div className={styles.info}>
              <FiCalendar />
              <time>{post.first_publication_date}</time>
              <FiUser />
              <p>{post.data.author}</p>
            </div>
          </a>
        ))}
      </div>
      {postsPagination.next_page != null ? <h1>olaaaaaaa</h1> : null}
    </main>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();

  const response = await prismic.getByType('posts', {
    lang: 'pt-BR',
    pageSize: 2,
  });

  console.log(response);

  const results = response.results.map(post => {
    return {
      uid: post.uid,
      data: {
        title: post.data.title,
        subtitle: post.data.subtitle,
        author: post.data.author,
      },
      first_publication_date: format(new Date(), 'dd MMM yyyy', {
        locale: ptBR,
      }),
    };
  });

  const postsPagination = {
    results,
    next_page: response.next_page,
  };

  return {
    props: {
      postsPagination,
    },
  };
};
