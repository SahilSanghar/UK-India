"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { deleteSession } from "@/lib/session";

export default function ClientPage({
  session,
}: {
  session: { username: string, name: string };
}) {
  const router = useRouter();
  const name = session?.name;

  const handleLogout = async () => {
    await deleteSession();
    router.push("/");
  };

  return (
    <div className="w-full h-screen flex flex-col gap-3 items-center justify-center">
      <div className="absolute w-fit top-0 right-0 p-5 flex items-center justify-center h-14 gap-2 "> 
      <Image src="/person.jpg" alt="logo" width={0} height={0} sizes="100vw" className="w-7 h-7 object-cover rounded-full" />
      <p className="text-black text-xl font-medium ml-auto"> {name} </p>
        <div onClick={() => handleLogout()} className='px-4 flex gap-1 py-2 hover:cursor-pointer bg-black/10 rounded-full font-medium'>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6"> <path strokeLinecap="round" strokeLinejoin="round" d="M5.636 5.636a9 9 0 1 0 12.728 0M12 3v9" /> </svg>
          <p>logout</p>
        </div>
      </div>
      <h1 className="text-4xl font-bold">
        Welcome, {name[0].toUpperCase() + name.slice(1)}
      </h1>
      </div>

  );
}
