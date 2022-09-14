import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { GetStaticPaths, GetStaticProps } from 'next';
import { RichText } from 'prismic-dom';

import { getPrismicClient } from '../../services/prismic';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post() {
  return (
    <main>
      {/* <img src="" alt="banner do post" />
      <article className={styles.post}>
        <h1>{post.title}</h1>
        <div className={styles.info}>
          <FiCalendar />
          <time>{post.first_publication_date}</time>
          <FiUser />
          <p>{post.data.author}</p>
        </div>
        <div
          className={styles.postContent}
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </article> */}
    </main>
  );
}

export const getStaticPaths = async () => {
  const prismic = getPrismicClient();
  const posts = await prismic.getByType('posts', {
    pageSize: 1,
    lang: 'pt-BR',
  });

  const response = posts.results.map(post => {
    return { params: { slug: post.uid } };
  });

  return {
    paths: response,
    fallback: true,
  };
};

export const getStaticProps = async ({ params }) => {
  const prismic = getPrismicClient();

  const { slug } = params;

  const response = await prismic.getByUID('posts', String(slug), {});

  console.log(response);

  const post = {
    first_publication_date: format(
      new Date(response.last_publication_date),
      'dd MMM yyyy',
      {
        locale: ptBR,
      }
    ),
    data: {
      title: Array.isArray(response.data.title)
        ? RichText.asText(response.data.title)
        : response.data.title,
      subtitle: response.data.subtitle,
      author: response.data.author,
      banner: response.data.banner,
      content: response.data.content.map((value: any) => {
        return {
          heading: value.heading,
          body: value.body,
        };
      }),
    },
  };

  return {
    props: {
      post,
    },
  };
};
