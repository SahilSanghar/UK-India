"use client";

import React, { useState } from 'react'
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function Page() {

  const router = useRouter();

    const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  const [message, setMessage] = useState<{ message: string, type: "success" | "error" | "", loading: boolean }>({
    message: "",
    type: "",
    loading: false
  })

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setMessage({
      message: "",
      type: "",
      loading: true
    })

    try {
      const response = await axios.get(`/api/admin?username=${username}&password=${password}`);

      if (response.status !== 200){
        setMessage({
          message: response.data.message || "Unknown Error!",
          type: "error",
          loading: false
        })
        return;
      }

      setMessage({
        message: response.data.message || "Login successful!",
        type: "success",
        loading: false
      })
      
      router.push('/admin/dashboard');


    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setMessage({
        message: error.response?.data?.message || error.message || "An error occurred. Please try again.",
        type: "error",
        loading: false
      })
    }
  }

  return (
    <div className='w-full h-screen flex flex-col gap-3 items-center justify-center'>
      <h1 className='text-4xl font-bold text-navy'>
        Admin Login
      </h1>
      <p className='text-base text-gray-500'>
        Login to your account to access the admin panel
      </p>
      <form action="" className='flex flex-col gap-4 w-full max-w-sm mt-10' onSubmit={(e) => handleSubmit(e)}>
        <input type="text" placeholder='Username' className='w-full px-4 py-2 border border-gray-300 rounded-md' value={username} required onChange={(e) => setUsername(e.target.value)} />
        <input type="password" placeholder='Password' className='w-full px-4 py-2 border border-gray-300 rounded-md' value={password} required onChange={(e) => setPassword(e.target.value)} />
        <button type='submit' className='w-full px-4 py-2 text-md font-bold bg-navy text-white rounded-md cursor-pointer' disabled={message.loading}>{message.loading ? "Loading..." : "Login"}</button>
      </form>
      {message.message && (
        <div className={`${message.type === "success" ? "text-green-500" : "text-red-500"} font-medium`}>
          {message.message}
        </div>
      )}
    </div>
  )
}
