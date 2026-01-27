"use client";

import React from 'react';

import InfoCard from '@/components/InfoCard';
import { useInfiniteQuery } from "@tanstack/react-query"
import axios from 'axios';


interface PostProps {
  id: number;
  title: string;
  image: string;
  slug: string;
}

export default function Page() {

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useInfiniteQuery({
    queryKey: ['posts'],
    queryFn: ({ pageParam }) => axios.get('/api/admin/posts', {
      params: {
        limit: 12,
        lastKey: pageParam ? JSON.stringify(pageParam) : undefined,
      }
    }).then(res => res.data),
    getNextPageParam: (lastPage) => lastPage.lastKey ?? undefined,
    initialPageParam: undefined,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  })

  const posts = data?.pages.flatMap(page => page.posts) ?? [];

  return (
    <>
    <div className="w-full h-full flex flex-col overflow-x-hidden bg-white pb-10">
      <h1 className="text-4xl font-bold flex items-center justify-center pt-10 pb-5 text-navy">
        News
      </h1>
      <p className='text-sm text-center flex items-center justify-center mb-10 bg-navy w-fit mx-auto rounded-full px-4 py-2 text-white'>Total Posts: {data?.pages[0].count ?? 0}</p>
      <div className="w-fit h-fit flex-col gap-10 justify-center items-center grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3 mx-auto">
        {posts?.map((post: PostProps) => (
          <InfoCard
            title1={post.title}
            image={post.image || "/person.jpg"}
            animation="center"
            key={post.id}
            link={"/news/" + post.slug}
            loading={isFetchingNextPage || isLoading ? true : false}
          />
        ))}
      </div>
      {hasNextPage && (
        <button
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
          className="mx-auto mt-10 px-6 py-2 bg-navy text-white rounded-full cursor-pointer"
        >
          {isFetchingNextPage ? "Loading..." : "Load more"}
        </button>
      )}
    </div>
    </>
  );
}
