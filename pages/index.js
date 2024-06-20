import { useUser } from "@auth0/nextjs-auth0/client";
import Head from "next/head";
import Link from "next/link";
import { UserIcon } from '@heroicons/react/24/solid';
import { LockClosedIcon } from '@heroicons/react/24/solid';
export default function Home() {
  
  const { user, isLoading, error } = useUser();
  
  console.log("USER: ",user);
  
  return (
    <>
      <Head>
        <title>Login or Signup</title>
      </Head>
      <div className="flex justify-center items-center min-h-screen w-full bg-gray-500 text-center text-white">
        {!user && (
          
          <div className="flex items-center justify-center min-h-screen bg-gray-500">
      <div className="bg-white p-6 rounded-lg shadow-lg text-center flex flex-col items-center justify-center w-80 h-96">
        <div className="mb-4">
          <LockClosedIcon className="mx-auto h-12 w-12 text-gray-700" /> {/* Login Icon */}
        </div>
        <h2 className="text-2xl  text-gray-700 font-bold mb-4">Login/Signup</h2> {/* Login Text */}
        <Link
          href="/api/auth/login"
          className="inline-block bg-red-500 hover:bg-red-500 text-white font-bold py-2 px-4 rounded"
        >
          Login/Signup
        </Link>
      </div>
    </div>
          
        )}

        {user && (
          <div className="min-h-screen bg-gray-500 flex items-center justify-center">
          <div className="w-full max-w-md mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="p-8">
              <div className="flex justify-center mb-4">
                <UserIcon className="h-16 w-16 text-gray-500" />
              </div>
              <h1 className="text-2xl font-bold text-center text-gray-800 my-4">Hello! <br></br><b>{user.nickname}</b></h1>
              <div className="flex flex-col items-center mt-6 space-y-4">
                <Link
                  href="/display"
                  className="w-full text-center rounded-md bg-red-500 px-5 py-2 text-white hover:bg-red-600"
                >
                  Discover New Recipes!
                </Link>
                <Link
                  href="/api/auth/logout"
                  className="w-full text-center rounded-md bg-red-500 px-4 py-2 text-white hover:bg-red-600"
                >
                  Log out
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </>
  );
}
