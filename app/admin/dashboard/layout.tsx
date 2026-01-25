import React from 'react'
import Link from 'next/link';

import { AdminNavbar } from '@/components/AdminNavbar';

export default function layout({ children }: { children: React.ReactNode }) {

  
  const links = [
    {
      name: "Posts",
      href: "/admin/dashboard/posts",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25M16.5 7.5V18a2.25 2.25 0 0 0 2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 0 0 2.25 2.25h13.5M6 7.5h3v3H6v-3Z" />
</svg>


      ),
    },
    {
      name: "Events",
      href: "/admin/dashboard/events",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
      </svg>
      
      ),
    },
    {
      name: "Projects",
      href: "/admin/dashboard/projects",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 0 1 4.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0 1 12 15a9.065 9.065 0 0 0-6.23-.693L5 14.5m14.8.8 1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0 1 12 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
</svg>

      ),
    },
    {
      name: "Reports",
      href: "/admin/dashboard/reports",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="m18.375 12.739-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3 3 0 1 1 19.5 7.372L8.552 18.32m.009-.01-.01.01m5.699-9.941-7.81 7.81a1.5 1.5 0 0 0 2.112 2.13" />
      </svg>
      

      ),
    },
  ];
  return (
    <>
    <AdminNavbar />
    <div className="flex flex-row ">
      <Sidebar links={links} />
      <div className="w-full h-screen flex flex-col gap-3 items-center justify-center">
        {children}
      </div>
    </div>
    </>
  )
}

export function Sidebar({ links }: {links: { name: string, href: string, icon: React.ReactNode }[] }) {
  
  return (
    <div className="w-1/5 h-screen border-r border-gray-200 pt-20">
      <div className="flex h-full flex-col ">
        {/* <div className="flex h-20 items-center justify-center border-b border-gray-200"> 
   
          <p className="text-xl font-bold text-black">Dashboard</p>
        </div> */}
        {links.map((link) => (
          <Link href={link.href} key={link.name} className="text-lg font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-100 px-5 py-2 w-full text-left border-b border-gray-200 flex items-center gap-2">
            {link.icon}
            {link.name}
          </Link>
        ))}
      </div>
    </div>
  );
}

