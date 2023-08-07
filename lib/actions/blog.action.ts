'use server';

import { revalidatePath } from 'next/cache';
import { BlogModel } from '../models/Blog';
import { UserModel } from '../models/User';
import { connectToDatabase } from '../mongoose';

interface Params {
  text: string;
  author: string;
  communityId: string | null;
  path: string;
}
export async function createBlog({ text, author, communityId, path }: Params) {
  try {
    connectToDatabase();

    const createdBlog = await BlogModel.create({
      text,
      author,
      community: null,
    });

    // update usermodel

    await UserModel.findByIdAndUpdate(author, {
      $push: { blogs: createdBlog._id },
    });

    revalidatePath(path);
  } catch (err: any) {
    console.log(`Error creating blog: ${err.message}`);
  }
}

export async function fetchBlogs(pageNum = 1, pageSize = 20) {
  try {
    connectToDatabase();

    // calculate the number of blogs to skip
    const skipNum = (pageNum - 1) * pageSize;

    const blogsQuery = BlogModel.find({ parentId: { $in: [null, undefined] } })
      .sort({ createdAt: 'desc' })
      .skip(skipNum)
      .limit(pageSize)
      .populate({
        path: 'author',
        model: UserModel,
      })
      // .populate({
      //   path: "community",
      //   model: CommunityModel,
      // })
      .populate({
        path: 'children', // Populate the children field
        populate: {
          path: 'author', // Populate the author field within children
          model: UserModel,
          select: '_id name parentId image', // Select only _id and username fields of the author
        },
      });

    // Count the total number of top-level posts (threads) i.e., threads that are not comments.
    const totalBlogsCount = await BlogModel.countDocuments({
      parentId: { $in: [null, undefined] },
    }); // Get the total count of posts

    const blogs = await blogsQuery.exec();

    const isNext = totalBlogsCount > skipNum + blogs.length;

    return { blogs, isNext };
  } catch (err: any) {
    throw new Error(`Error fetching blogs: ${err.message}`);
  }
}
