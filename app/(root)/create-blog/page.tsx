import React from 'react';
import { currentUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import { fetchUser } from '@/lib/actions/user.action';
import PostBlog from '@/components/forms/PostBlog';

export default async function CreateBlogPage() {
  const user = await currentUser();

  if (!user) {
    // redirect('/login');
    return null;
  }

  const userInfo = await fetchUser(user.id);

  if (!userInfo?.onboarded) {
    redirect('/on-boarding');
  }

  return (
    <>
      <h1 className="head-text">Create Blog</h1>

      <PostBlog userId={userInfo._id} />
    </>
  );
}
