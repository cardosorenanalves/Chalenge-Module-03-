/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable jsx-a11y/anchor-is-valid */
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { GetStaticProps } from 'next';
import Link from 'next/link';
import { useEffect, useState } from 'react';

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
  const [posts, setPosts] = useState<Post[]>([]);
  const [nextPage, setNextPage] = useState<string>('');

  useEffect(() => {
    setPosts(postsPagination.results);
    setNextPage(postsPagination.next_page);
  }, []);

  function getOtherPosts() {
    fetch(nextPage)
      .then(t => t.json())
      .then(response => {
        const data = [...posts, ...response.results];
        setNextPage(response.next_page);
        setPosts(data);
      });
  }

  return (
    <main className={styles.conteiner}>
      <div className={styles.post}>
        {posts.map(post => (
          <Link href={`/post/${post.uid}`}>
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
          </Link>
        ))}
      </div>
      {nextPage != null ? (
        <div className={styles.loadingPosts} onClick={getOtherPosts}>
          <p>Carregar mais posts</p>
        </div>
      ) : null}
    </main>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();

  const response = await prismic.getByType('posts', {
    lang: 'pt-BR',
  });

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
