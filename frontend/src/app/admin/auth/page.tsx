/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"
import Link from "next/link";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginSchema } from "../../../../../schemas/loginSchema";
import { signupSchema, SignupSchema } from "../../../../../schemas/signupSchema";
import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { toast } from 'react-hot-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { useUserStore } from "@/store/userStore";
import { loginUser, signupUser } from "@/lib/api"; 

export default function LoginPage() {  
    const { setToken } = useAuthStore(); // Zustand store for token
    const setUser = useUserStore((state) => state.setUser); 
    const { reset: resetLogin, register: registerLogin, handleSubmit: handleSubmitLogin, formState: { errors: errorsLogin, isSubmitting: isSubmittingLogin } } = useForm<LoginSchema>({ resolver: zodResolver(loginSchema) });
    const { reset: resetSignup, register: registerSignup, handleSubmit: handleSubmitSignup, formState: { errors: errorsSignup, isSubmitting: isSubmittingSignup } } = useForm<SignupSchema>({ resolver: zodResolver(signupSchema) });
    const router=useRouter();

    const onSubmitLogin = async (loginData: LoginSchema) => {
        try{
            const data= await loginUser(loginData.email, loginData.password, "admin");
            if(!data){
                toast.error("Invalid credentials");
                return;
            }
            const token = data.token;
            setToken(token, true);
            setUser(data.user);
            await new Promise((resolve)=> setTimeout(resolve, 500)); //simulating API authentication process
            toast.success("Login successful");
            router.push('/admin/dashboard');
            resetLogin();
        } catch(err){
            toast.error("Invalid credentials");
        }
    }

    const onSubmitSignup = async (signupData: SignupSchema) => {
        try{
            const data= await signupUser(signupData.name, signupData.email, signupData.password, signupData.confirmPassword, "admin");
            if(!data){
                toast.error("Invalid credentials. Please try again later.");
                return;
            }
            const token = data.token;
            setToken(token, true);
            
            setUser(data.user);
            await new Promise((resolve)=> setTimeout(resolve, 500)); //simulating API authentication process
            toast.success("Admin account created. Please wait for approval.");
            router.push('/');
            resetSignup();
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
            <p>Admin Portal</p>
              </CardTitle>
              <CardDescription className="text-center text-slate-500">Login to your admin account or request access</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 ">
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-gray-300">
                <TabsTrigger value="login" className="text-sm font-medium transition-all  data-[state=active]:bg-slate-100 data-[state=active]:text-black  data-[state=active]:shadow-none">Login</TabsTrigger>
                <TabsTrigger value="signup" className="text-sm font-medium transition-all  data-[state=active]:bg-slate-100 data-[state=active]:text-black  data-[state=active]:shadow-none">Signup</TabsTrigger>
              </TabsList>

            <TabsContent value="login">
            <form onSubmit={handleSubmitLogin(onSubmitLogin)} noValidate className="space-y-4 pb-2">
                <div>
                    <Label className="font-semibold pb-2 pl-1" htmlFor="email">Email</Label>
                    <Input className="py-3" id="email" type="email" placeholder="Enter your email" {...registerLogin("email")} />
                    {errorsLogin.email && <p className="text-red-500 text-sm mt-1">{errorsLogin.email.message}</p>}
                </div>
                <div>
                    <Label className="font-semibold pb-2 pl-1" htmlFor="password">Password</Label>
                    <Input className="py-3" id="password" type="password" placeholder="Enter your password" {...registerLogin("password")} />
                    {errorsLogin.password && <p className="text-red-500 text-sm mt-1">{errorsLogin.password.message}</p>}
                </div>
              <Button className="w-full bg-slate-500 text-white" type={"submit"} disabled={isSubmittingLogin}>  
                {isSubmittingLogin?  <Loader2 className="animate-spin w-5 h-5" /> : "Log In"}
              </Button>
            </form>
            </TabsContent>

            <TabsContent value="signup">
            <form onSubmit={handleSubmitSignup(onSubmitSignup)} noValidate className="space-y-4 pb-2">
                <div>
                    <Label className="font-semibold pb-2 pl-1" htmlFor="name">Name</Label>
                    <Input className="py-3" id="name" type="name" placeholder="Enter your name" {...registerSignup("name")} />
                    {errorsSignup.name && <p className="text-red-500 text-sm mt-2">{errorsSignup.name.message}</p>}
                </div>
                <div>
                    <Label className="font-semibold pb-2 pl-1" htmlFor="email">Email</Label>
                    <Input className="py-3" id="email" type="email" placeholder="Enter your email" {...registerSignup("email")} />
                    {errorsSignup.email && <p className="text-red-500 text-sm mt-2">{errorsSignup.email.message}</p>}
                </div>
                <div>
                    <Label className="font-semibold pb-2 pl-1" htmlFor="password">Password</Label>
                    <Input className="py-3" id="password" type="password" placeholder="Create your password" {...registerSignup("password")} />
                    {errorsSignup.password && <p className="text-red-500 text-sm mt-2">{errorsSignup.password.message}</p>}
                </div>
                <div>
                    <Label className="font-semibold pb-2 pl-1" htmlFor="re-password">Confirm Password</Label>
                    <Input className="py-3" id="re-password" type="password" placeholder="Re-enter your password" {...registerSignup("confirmPassword")} />
                    {errorsSignup.confirmPassword && <p className="text-red-500 text-sm mt-2">{errorsSignup.confirmPassword.message}</p>}
                </div>
              <Button className="w-full bg-slate-500 text-white" type="submit" disabled={isSubmittingSignup}>
                {isSubmittingSignup ? <Loader2 className="animate-spin w-5 h-5" /> : "Request Access"}
              </Button>
            </form>
            </TabsContent>
            </Tabs>
            </CardContent>
            <CardFooter className="flex flex-col justify-center items-center pb-2">
                <p className="text-xs text-slate-600">By continuing, you agree to our Terms of Service and Privacy Policy.</p>
            </CardFooter>
        </Card>
    </div>
  )
}

