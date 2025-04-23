"use client";
import * as React from 'react';
import { useState } from 'react';
import Link from "next/link";
import { Search, ShoppingCart,  } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useRouter } from 'next/navigation';
import { useSearchStore } from '@/store/searchStore';
import { useAuthStore } from '@/store/authStore';
import { useUserStore } from '@/store/userStore';

export const Navbar=()=>{
    const isLogged= useAuthStore((state)=>state.isAuthenticated);
    const user= useUserStore((state)=>state.user);
    const searchQuery= useSearchStore((state)=>state.searchQuery);
    const setSearchQuery= useSearchStore((state)=>state.setSearchQuery);
    const router=useRouter();

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            if(searchQuery.trim() === "") {
                return;
            }
            router.push("/products");
        }
    };
    const handleClick=()=>{
        if(searchQuery.trim() === "") {
            return;
        }
        router.push("/products");
    }
    return(
        <div className="sticky z-50 top-0 w-full font-sans border-b bg-white flex flex-row py-2 justify-between">
            <div className='flex flex-row justify-between items-center space-x-4'>
                <Link href="/" className="flex flex-row justify-center items-center space-x-2 px-10 mr-5 transform transition-transform duration-150 ease-[cubic-bezier(0.4,0,0.2,1)] hover:scale-[1.03] hover:-translate-y-0.5">
                    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="40" height="40" viewBox="0 0 48 48">
                        <path fill="#1976D2" d="M37.216,11.78c-0.023-0.211-0.211-0.305-0.351-0.305s-3.21-0.234-3.21-0.234s-2.132-2.132-2.39-2.343   c-0.234-0.234-0.68-0.164-0.867-0.117c-0.023,0-0.469,0.141-1.195,0.375c-0.726-2.086-1.968-3.984-4.194-3.984h-0.211   C24.187,4.375,23.391,4,22.735,4c-5.155,0-7.639,6.444-8.412,9.725c-2.015,0.633-3.445,1.054-3.609,1.125   c-1.125,0.351-1.148,0.375-1.289,1.429c-0.117,0.797-3.046,23.456-3.046,23.456L29.179,44l12.373-2.671 C41.575,41.282,37.24,11.991,37.216,11.78z M27.937,9.483c-0.562,0.164-1.242,0.375-1.921,0.609V9.671  c0-1.265-0.164-2.296-0.469-3.117C26.718,6.695,27.445,7.984,27.937,9.483L27.937,9.483z M24.117,6.812 c0.305,0.797,0.516,1.922,0.516,3.468v0.234c-1.265,0.398-2.601,0.797-3.984,1.242C21.422,8.804,22.899,7.351,24.117,6.812  L24.117,6.812z M22.617,5.359c0.234,0,0.469,0.094,0.656,0.234c-1.664,0.773-3.421,2.718-4.148,6.655   c-1.101,0.351-2.156,0.656-3.163,0.984C16.806,10.233,18.915,5.359,22.617,5.359z"></path>
                        <path fill="#1976D2" d="M36.865,11.428c-0.141,0-3.21-0.234-3.21-0.234s-2.132-2.132-2.39-2.343    C31.17,8.757,31.053,8.71,30.96,8.71L29.249,44l12.373-2.671c0,0-4.335-29.338-4.359-29.549    C37.169,11.569,37.005,11.475,36.865,11.428z"></path>
                        <path fill="#fff" d="M24.792,18.593l-1.475,4.449c0,0-1.337-0.715-2.927-0.715c-2.374,0-2.489,1.498-2.489,1.867   c0,2.028,5.301,2.812,5.301,7.583c0,3.757-2.374,6.177-5.578,6.177c-3.872,0-5.808-2.397-5.808-2.397l1.037-3.411   c0,0,2.028,1.752,3.734,1.752c1.129,0,1.59-0.876,1.59-1.521c0-2.651-4.333-2.766-4.333-7.145c0-3.665,2.628-7.214,7.952-7.214  C23.777,17.994,24.792,18.593,24.792,18.593z"></path>
                    </svg>
                    <h1 className="text-xl font-semibold">ShopCart</h1>
                </Link>

                <Input value={searchQuery} onKeyDown={handleKeyDown} onChange={(e: React.ChangeEvent<HTMLInputElement>)=>setSearchQuery(e.target.value)} id='search' className="max-w-md hidden md:block md:w-96 " placeholder="Search for products" />
                <Tooltip>
                    <TooltipTrigger asChild>
                        <div className="flex flex-row justify-center items-center space-x-4">
                            <Label htmlFor='search' className='cursor-pointer transform transition-transform duration-150 ease-[cubic-bezier(0.4,0,0.2,1)] hover:scale-[1.03] hover:-translate-y-0.5' onClick={handleClick}><Search /></Label>
                        </div>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p className='text-white'>Search</p>
                    </TooltipContent>
                </Tooltip>
            </div>

            <div className='flex flex-row justify-center items-center px-10'>
                {!isLogged ? (
                    <Link href="/login" className=''>
                        <Button variant={'outline'} className='bg-slate-200'>
                            Log In
                        </Button>
                    </Link>
                ) : (
                    <div className='flex flex-row justify-between items-center space-x-5 '>
                        <Tooltip>
                            <TooltipTrigger asChild>
                            <Button onClick={()=>{router.push('/cart')}} variant={'ghost'} className='flex flex-row h-full'>
                            <ShoppingCart className="h-6 w-6" />
                            <h3 className='text-sm'>Cart</h3>
                        </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p className='text-white'>Cart</p>
                            </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button onClick={() => router.push("/account")} variant="ghost" className="p-0 h-9 w-9 rounded-full">
                                <Avatar className="h-9 w-9">
                                    <AvatarImage src={user.picture} alt="Profile" />
                                    <AvatarFallback>JD</AvatarFallback>
                                </Avatar>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p className='text-white'>{user.name}</p>
                            </TooltipContent>
                        </Tooltip>
                    </div>
                )}
            </div>
        </div>
    );
}