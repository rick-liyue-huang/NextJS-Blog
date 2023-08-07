'use server';

import { revalidatePath } from 'next/cache';
import { UserModel } from '../models/User';
import { connectToDatabase } from '../mongoose';

interface UpdateUserParams {
  userId: string;
  username: string;
  name: string;
  image: string;
  bio: string;
  path: string;
}
export async function updateUser({
  userId,
  username,
  name,
  image,
  bio,
  path,
}: UpdateUserParams): Promise<void> {
  connectToDatabase(); // connect to database

  try {
    await UserModel.findOneAndUpdate(
      {
        id: userId,
      },
      {
        username: username.toLowerCase(),
        name,
        image,
        bio,
        onboarded: true,
      },
      {
        upsert: true,
      }
    );

    if (path === '/profile/edit') {
      revalidatePath(path);
    }
  } catch (err: any) {
    throw new Error(`Error updating user: ${err.message}`);
  }
}
