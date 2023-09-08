import Head from "next/head";
import { useEffect } from "react";

// components
import NotionRenderer from "components/NotionRenderer";

// services
import notionServices from "services/notion";

// types
import type { GetStaticPaths, GetStaticProps } from "next";
import type { APIPostResponse } from "@types";

interface Props {
  pageData?: APIPostResponse;
  isError?: boolean;
}

interface Params {
  [key: string]: string;
  postId: string;
}

const PostDetail = ({ pageData, isError }: Props) => {
  useEffect(() => {
    if (isError) {
      alert("페이지가 존재하지 않습니다.");
    }
  }, [isError]);

  if (!pageData) {
    return null;
  }

  return (
    <>
      <Head>
        <title>{pageData.title}</title>
        <meta name="description" content="jhdev 개발 블로그" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <NotionRenderer blocks={pageData.blocks} />
    </>
  );
};

export const getStaticPaths: GetStaticPaths<Params> = async () => {
  const response = await notionServices.getList();

  return {
    paths: response.map((item) => ({
      params: { postId: item.id },
    })),
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps<Props, Params> = async ({
  params,
}) => {
  try {
    if (params?.postId) {
      const pageData = await notionServices.getPage(params.postId);

      return {
        props: { pageData },
        revalidate: 3500,
      };
    }

    return {
      props: {
        isError: true,
      },
    };
  } catch (err) {
    return {
      props: { isError: true },
    };
  }
};

export default PostDetail;
