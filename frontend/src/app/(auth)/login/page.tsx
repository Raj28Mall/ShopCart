/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"
import Link from "next/link";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginSchema } from "../../../../../schemas/loginSchema";
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { toast } from 'react-hot-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { useUserStore } from "@/store/userStore";
import { loginUser } from "@/lib/api"; 

export default function LoginPage() {  
    const { setToken } = useAuthStore(); // Zustand store for token
    const setUser = useUserStore((state) => state.setUser); 
    const { reset, register, handleSubmit, formState: { errors, isSubmitting }} = useForm<LoginSchema>({ resolver: zodResolver(loginSchema) });
    const router=useRouter();

    const onSubmit = async (loginData: LoginSchema) => {
        try{
            const data= await loginUser(loginData.email, loginData.password, "user");
            if(!data){
                toast.error("Invalid credentials");
                return;
            }
            const token = data.token;
            setToken(token, false);
            setUser(data.user);
            await new Promise((resolve)=> setTimeout(resolve, 500)); //simulating API authentication process
            toast.success("Login successful");
            router.push('/');
            reset();
        } catch(err){
            toast.error("Invalid credentials");
        }
    }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-0 my-0 ">
      <Card className="w-full max-w-md pb-6 pt-3 font-sans bg-slate-100 shadow-2xl">
            <CardHeader>
              <CardTitle className="text-2xl mt-0 text-center space-y-2">
              <Link href="/" className="mt-3 flex flex-row justify-center items-center space-x-2 transform transition-transform duration-150 ease-[cubic-bezier(0.4,0,0.2,1)] hover:scale-[1.03] hover:-translate-y-0.5">
                <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="75" height="75" viewBox="0 0 48 48">
                    <path fill="#1976D2" d="M37.216,11.78c-0.023-0.211-0.211-0.305-0.351-0.305s-3.21-0.234-3.21-0.234s-2.132-2.132-2.39-2.343   c-0.234-0.234-0.68-0.164-0.867-0.117c-0.023,0-0.469,0.141-1.195,0.375c-0.726-2.086-1.968-3.984-4.194-3.984h-0.211   C24.187,4.375,23.391,4,22.735,4c-5.155,0-7.639,6.444-8.412,9.725c-2.015,0.633-3.445,1.054-3.609,1.125   c-1.125,0.351-1.148,0.375-1.289,1.429c-0.117,0.797-3.046,23.456-3.046,23.456L29.179,44l12.373-2.671 C41.575,41.282,37.24,11.991,37.216,11.78z M27.937,9.483c-0.562,0.164-1.242,0.375-1.921,0.609V9.671  c0-1.265-0.164-2.296-0.469-3.117C26.718,6.695,27.445,7.984,27.937,9.483L27.937,9.483z M24.117,6.812 c0.305,0.797,0.516,1.922,0.516,3.468v0.234c-1.265,0.398-2.601,0.797-3.984,1.242C21.422,8.804,22.899,7.351,24.117,6.812  L24.117,6.812z M22.617,5.359c0.234,0,0.469,0.094,0.656,0.234c-1.664,0.773-3.421,2.718-4.148,6.655   c-1.101,0.351-2.156,0.656-3.163,0.984C16.806,10.233,18.915,5.359,22.617,5.359z"></path>
                    <path fill="#1976D2" d="M36.865,11.428c-0.141,0-3.21-0.234-3.21-0.234s-2.132-2.132-2.39-2.343    C31.17,8.757,31.053,8.71,30.96,8.71L29.249,44l12.373-2.671c0,0-4.335-29.338-4.359-29.549    C37.169,11.569,37.005,11.475,36.865,11.428z"></path>
                    <path fill="#fff" d="M24.792,18.593l-1.475,4.449c0,0-1.337-0.715-2.927-0.715c-2.374,0-2.489,1.498-2.489,1.867   c0,2.028,5.301,2.812,5.301,7.583c0,3.757-2.374,6.177-5.578,6.177c-3.872,0-5.808-2.397-5.808-2.397l1.037-3.411   c0,0,2.028,1.752,3.734,1.752c1.129,0,1.59-0.876,1.59-1.521c0-2.651-4.333-2.766-4.333-7.145c0-3.665,2.628-7.214,7.952-7.214  C23.777,17.994,24.792,18.593,24.792,18.593z"></path>
                </svg>
            </Link>
            <p>Sign In</p>
              </CardTitle>
              <CardDescription className="text-center text-slate-500">Sign in to your account</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 ">
            <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4 pb-2">
                <div>
                    <Label className="font-semibold pb-2 pl-1" htmlFor="email">Email</Label>
                    <Input className="py-3" id="email" type="email" placeholder="Enter your email" {...register("email")} />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                </div>
                <div>
                    <Label className="font-semibold pb-2 pl-1" htmlFor="password">Password</Label>
                    <Input className="py-3" id="password" type="password" placeholder="Enter your password" {...register("password")} />
                    {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
                </div>
              <Button className="w-full bg-slate-500 text-white" type={"submit"} disabled={isSubmitting}>  
                {isSubmitting?  <Loader2 className="animate-spin w-5 h-5" /> : "Log In"}
              </Button>

            </form>

            </CardContent>
            <CardFooter className="flex flex-col justify-center items-center pb-2">
                <div className="w-full flex flex-row justify-center items-center space-x-2 mb-5">
                    <Button className="w-1/2 rounded-sm py-5" variant="outline" >
                        <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            fill="#4285F4"
                        />
                        <path
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            fill="#34A853"
                        />
                        <path
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            fill="#FBBC05"
                        />
                        <path
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            fill="#EA4335"
                        />
                        </svg>
                    </Button>

                    <Button className="w-1/2 rounded-sm py-5" variant="outline" >
                        <svg className="mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 50 50">
                            <path d="M17.791,46.836C18.502,46.53,19,45.823,19,45v-5.4c0-0.197,0.016-0.402,0.041-0.61C19.027,38.994,19.014,38.997,19,39 c0,0-3,0-3.6,0c-1.5,0-2.8-0.6-3.4-1.8c-0.7-1.3-1-3.5-2.8-4.7C8.9,32.3,9.1,32,9.7,32c0.6,0.1,1.9,0.9,2.7,2c0.9,1.1,1.8,2,3.4,2 c2.487,0,3.82-0.125,4.622-0.555C21.356,34.056,22.649,33,24,33v-0.025c-5.668-0.182-9.289-2.066-10.975-4.975 c-3.665,0.042-6.856,0.405-8.677,0.707c-0.058-0.327-0.108-0.656-0.151-0.987c1.797-0.296,4.843-0.647,8.345-0.714 c-0.112-0.276-0.209-0.559-0.291-0.849c-3.511-0.178-6.541-0.039-8.187,0.097c-0.02-0.332-0.047-0.663-0.051-0.999 c1.649-0.135,4.597-0.27,8.018-0.111c-0.079-0.5-0.13-1.011-0.13-1.543c0-1.7,0.6-3.5,1.7-5c-0.5-1.7-1.2-5.3,0.2-6.6 c2.7,0,4.6,1.3,5.5,2.1C21,13.4,22.9,13,25,13s4,0.4,5.6,1.1c0.9-0.8,2.8-2.1,5.5-2.1c1.5,1.4,0.7,5,0.2,6.6c1.1,1.5,1.7,3.2,1.6,5 c0,0.484-0.045,0.951-0.11,1.409c3.499-0.172,6.527-0.034,8.204,0.102c-0.002,0.337-0.033,0.666-0.051,0.999 c-1.671-0.138-4.775-0.28-8.359-0.089c-0.089,0.336-0.197,0.663-0.325,0.98c3.546,0.046,6.665,0.389,8.548,0.689 c-0.043,0.332-0.093,0.661-0.151,0.987c-1.912-0.306-5.171-0.664-8.879-0.682C35.112,30.873,31.557,32.75,26,32.969V33 c2.6,0,5,3.9,5,6.6V45c0,0.823,0.498,1.53,1.209,1.836C41.37,43.804,48,35.164,48,25C48,12.318,37.683,2,25,2S2,12.318,2,25 C2,35.164,8.63,43.804,17.791,46.836z"></path>
                        </svg>
                    </Button>
                </div>
                
                <div className="flex flex-row space-x-4">
                    <Link href="/signup" className="text-sm pt-2 underline cursor-pointer">
                        Dont have an account?
                    </Link>
                    <Link href={"/admin/auth"} className="text-sm pt-2 underline cursor-pointer">
                        Admin Login
                    </Link>
                </div>
            </CardFooter>
        </Card>
    </div>
  )
}

