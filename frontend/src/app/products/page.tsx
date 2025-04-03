/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import * as React from 'react';
import { useState, useEffect } from 'react';
import { Navbar } from "@/components/navbar";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check, ShoppingBag, ArrowDown, ChevronDown, X } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from '@/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger,} from "@/components/ui/popover"
interface Products{
    id: number;
    name: string;
    price: number;
    image: string;
}

export default function Products(){
    const [sortOption, setSortOption] = useState("featured");
    const []=useState("filter");
    const [products, setProducts] = useState<Products[]>([
        {
          id: 1,
          name: "Premium Cotton T-Shirt",
          price: 29.99,
          image: "/placeholder.svg?height=250&width=250",
        },
        {
          id: 2,
          name: "Wireless Headphones",
          price: 129.99,
          image: "/placeholder.svg?height=250&width=250",
        },
        {
          id: 3,
          name: "Ceramic Coffee Mug",
          price: 19.99,
          image: "/placeholder.svg?height=250&width=250",
        },
        {
          id: 4,
          name: "Slim Fit Jeans",
          price: 59.99,
          image: "/placeholder.svg?height=250&width=250",
        },
        {
          id: 5,
          name: "Slim Fit Jeans",
          price: 59.99,
          image: "/placeholder.svg?height=250&width=250",
        },
        {
          id: 6,
          name: "Slim Fit Jeans",
          price: 59.99,
          image: "/placeholder.svg?height=250&width=250",
        },
        {
          id: 7,
          name: "Slim Fit Jeans",
          price: 59.99,
          image: "/placeholder.svg?height=250&width=250",
        },
        {
          id: 8,
          name: "Slim Fit Jeans",
          price: 59.99,
          image: "/placeholder.svg?height=250&width=250",
        },
        {
          id: 9,
          name: "Slim Fit Jeans",
          price: 59.99,
          image: "/placeholder.svg?height=250&width=250",
        },
        {
          id: 10,
          name: "Slim Fit Jeans",
          price: 59.99,
          image: "/placeholder.svg?height=250&width=250",
        },
        {
          id: 11,
          name: "Slim Fit Jeans",
          price: 59.99,
          image: "/placeholder.svg?height=250&width=250",
        },
      ]);
    
    const [selected, setSelected]=useState<string[]>([]);

    const toggleSelection = (value: string) => {
      setSelected((prev) =>
        prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
      );
    };
    
    return(
        <div className="flex flex-col justify-center items-center font-sans min-h-screen">
            <Navbar/>
            <div className='flex flex-row justify-between items-center px-12 py-4 mt-5 mx-5 w-[100vw]'>
                <h1 className='text-3xl font-bold'>All Products</h1>
                <div className='flex flex-row space-x-2'>
                    {selected.map((item)=>(
                        <div key={item} className='bg-slate-100 px-2 py-1 rounded-md flex justify-center items-center'>
                            {item}
                            <Button variant={'ghost'} size={'xs'} className='ml-2' onClick={() => toggleSelection(item)}><X/></Button>
                        </div>
                    ))}
                </div>
                <div className='flex flex-row space-x-2'>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className='flex flex-row justify-center items-center space-x-8'>
                      <span className=''>Filters</span><ChevronDown className='text-muted-foreground'/>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-56">
                    <div className="flex flex-col gap-2 p-2">
                      {["Clothes", "Electronics", "Kitchen Appliances", "Sports", "Beauty"].map((option) => (
                        <label key={option} className="flex items-center gap-2">
                          <Checkbox
                            checked={selected.includes(option)}
                            onCheckedChange={() => toggleSelection(option)}
                          />
                          {option}
                        </label>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>

                <Select value={sortOption} onValueChange={setSortOption}>
                <SelectTrigger className="w-[180px] hover:bg-slate-100">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent className=''>
                  <SelectItem className='' value="featured">Featured</SelectItem>
                  <SelectItem className='' value="newest">Newest</SelectItem>
                  <SelectItem className='' value="price-low">Price: Low to High</SelectItem>
                  <SelectItem className='' value="price-high">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>

                </div>
            </div>
            
            {/* Sidebar  */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-6 gap-x-8 my-8 px-12 w-[90vw]">
            {(products.slice(0,15)).map((product) => ( // show 30 products
              <Link key={product.id} href={`/products/${product.id}`} className="">
                <Card className="overflow-hidden transition-all hover:shadow-lg pt-0">
                  <div className="relative h-[250px] w-full">
                    <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
                  </div>
                  <CardContent className="px-4">
                    <h3 className="font-semibold">{product.name}</h3>
                    <div className="flex items-center justify-between mt-2">
                      <span className="font-bold">${product.price.toFixed(2)}</span>
                      <Button size="sm" variant={'outline'} className="">
                        <ShoppingBag className="h-4 w-4 mr-2" />
                        Add to Cart
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
    );
}