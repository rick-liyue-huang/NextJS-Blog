import AccountProfile from '@/components/forms/AccountProfile';
import { fetchUser } from '@/lib/actions/user.action';
import { currentUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

export default async function OnBoardingPage() {
  const user = await currentUser();

  if (!user) return null; // to avoid typescript warnings

  // get user info from the database
  // const userInfo = {
  //   _id: '',
  //   name: '',
  //   bio: '',
  //   image: '',
  // };
  const userInfo = await fetchUser(user.id);

  if (userInfo?.onboarded) redirect('/');

  const userData = {
    id: user.id,
    objectId: userInfo?._id,
    username: userInfo ? userInfo?.username : user.username,
    name: userInfo ? userInfo?.name : user.firstName ?? '',
    bio: userInfo ? userInfo?.bio : '',
    image: userInfo ? userInfo?.image : user.imageUrl,
  };

  return (
    <main className="mx-auto flex max-w-3xl flex-col justify-start px-10 py-20">
      <h1 className="head-text">OnBoardingPage</h1>
      <p className="mt-3 text-base-regular text-light-2">
        Complete your profile to get started
      </p>

      <section className="mt-9 bg-dark-2 p-10">
        <AccountProfile user={userData} btnTitle="Continue" />
      </section>
    </main>
  );
}
