//app/page.tsx

import BlogCard from '@/components/cards/BlogCard';
import { fetchBlogs } from '@/lib/actions/blog.action';
import { currentUser } from '@clerk/nextjs';

export default async function Home() {
  const results = await fetchBlogs(1, 30);
  const user = await currentUser();

  console.log(results);

  return (
    <div>
      <h1 className="head-text text-left">Home</h1>

      <section className="mt-9 flex flex-col gap-10 ">
        {results.blogs.length === 0 ? (
          <p className="no-result">No Blogs Found</p>
        ) : (
          <>
            {results.blogs.map((blog) => (
              <BlogCard
                key={blog._id}
                id={blog._id}
                currentUserId={user?.id || ''}
                parentId={blog.parentId}
                content={blog.text}
                author={blog.author}
                community={blog.community}
                createdAt={blog.createdAt}
                comments={blog.children} // ??
              />
            ))}
          </>
        )}
      </section>
    </div>
  );
}
