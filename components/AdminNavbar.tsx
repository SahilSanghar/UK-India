"use client";

import { deleteSession } from "@/lib/session";
import Image from "next/image";
import { useRouter } from "next/navigation";

export  function AdminNavbar() {
  const router = useRouter();
  const handleLogout = () => {
    deleteSession();
    router.push("/");
  };
  return (
   <div className="z-20 fixed w-full bg-white border-b border-gray-200 top-0 right-0 p-5 flex items-center justify-center gap-2 h-20"> 
    <div className="w-28 h-auto flex gap-2" onClick={() => router.push("/admin/dashboard")}>
    <Image src="/logo.jpg" alt="logo" width={0} height={0} sizes="100vw" className="w-full h-full object-cover" />
    </div>
 
  {/* <p className="text-black text-xl font-medium ml-auto"> {name} </p> */}
    <div onClick={() => handleLogout()} className='px-4 flex gap-1 py-2 hover:cursor-pointer bg-black/10 rounded-full font-medium ml-auto'>
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6"> <path strokeLinecap="round" strokeLinejoin="round" d="M5.636 5.636a9 9 0 1 0 12.728 0M12 3v9" /> </svg>
      <p>logout</p>
    </div>
  </div>
  );
} 