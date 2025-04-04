"use client";
import { Navbar } from "@/components/navbar";
import * as React from 'react';
import { useState, useEffect } from 'react';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Cart(){
    return(
        <div className="overflow-x-hidden min-h-screen">
            <Navbar/>
            <h1 className='text-3xl font-bold pt-3 mt-8 mx-12'>Shopping Cart</h1>
        </div>
    );
}