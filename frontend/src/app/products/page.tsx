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
import { useProductStore } from '@/store/productStore';
interface Products{
    id: number;
    name: string;
    price: number;
    image: string;
}

export default function Products(){
    const [sortOption, setSortOption] = useState("featured");
    const [displayCount, setDisplayCount]=useState<number>(15);
    const products= useProductStore((state) => state.products);
    const setProducts= useProductStore((state) => state.setProducts);
    

    useEffect(() => {
      setProducts([
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
          name: "Eco-Friendly Notebook",
          price: 9.99,
          image: "/placeholder.svg?height=250&width=250",
        },
        {
          id: 5,
          name: "Bluetooth Speaker",
          price: 49.99,
          image: "/placeholder.svg?height=250&width=250",
        },
        {
          id: 6,
          name: "Running Shoes",
          price: 89.99,
          image: "/placeholder.svg?height=250&width=250",
        },
        {
          id: 7,
          name: "Stainless Steel Water Bottle",
          price: 24.99,
          image: "/placeholder.svg?height=250&width=250",
        },
        {
          id: 8,
          name: "Minimalist Wristwatch",
          price: 199.99,
          image: "/placeholder.svg?height=250&width=250",
        },
        {
          id: 9,
          name: "Laptop Stand",
          price: 39.99,
          image: "/placeholder.svg?height=250&width=250",
        },
        {
          id: 10,
          name: "Desk Organizer Set",
          price: 17.99,
          image: "/placeholder.svg?height=250&width=250",
        },
        {
          id: 11,
          name: "LED Desk Lamp",
          price: 34.99,
          image: "/placeholder.svg?height=250&width=250",
        },
        {
          id: 12,
          name: "Smartphone Tripod",
          price: 22.49,
          image: "/placeholder.svg?height=250&width=250",
        },
        {
          id: 13,
          name: "Noise-Cancelling Earbuds",
          price: 79.99,
          image: "/placeholder.svg?height=250&width=250",
        },
        {
          id: 14,
          name: "Portable Charger 10000mAh",
          price: 29.49,
          image: "/placeholder.svg?height=250&width=250",
        },
        {
          id: 15,
          name: "Leather Wallet",
          price: 39.99,
          image: "/placeholder.svg?height=250&width=250",
        },
        {
          "id": 16,
          "name": "Gaming Mouse",
          "price": 59.99,
          "image": "/placeholder.svg?height=250&width=250"
        },
        {
          "id": 17,
          "name": "Wireless Mechanical Keyboard",
          "price": 109.99,
          "image": "/placeholder.svg?height=250&width=250"
        },
        {
          "id": 18,
          "name": "4K Webcam",
          "price": 89.99,
          "image": "/placeholder.svg?height=250&width=250"
        },
        {
          "id": 19,
          "name": "Ergonomic Office Chair",
          "price": 249.99,
          "image": "/placeholder.svg?height=250&width=250"
        },
        {
          "id": 20,
          "name": "Smart LED Light Strips",
          "price": 34.99,
          "image": "/placeholder.svg?height=250&width=250"
        },
        {
          "id": 21,
          "name": "USB-C Docking Station",
          "price": 79.99,
          "image": "/placeholder.svg?height=250&width=250"
        },
        {
          "id": 22,
          "name": "Adjustable Standing Desk",
          "price": 399.99,
          "image": "/placeholder.svg?height=250&width=250"
        },
        {
          "id": 23,
          "name": "Noise-Isolating Microphone",
          "price": 119.99,
          "image": "/placeholder.svg?height=250&width=250"
        },
        {
          "id": 24,
          "name": "Foldable Laptop Stand",
          "price": 27.99,
          "image": "/placeholder.svg?height=250&width=250"
        },
        {
          "id": 25,
          "name": "Fitness Tracker Watch",
          "price": 79.99,
          "image": "/placeholder.svg?height=250&width=250"
        },
        {
          "id": 26,
          "name": "Anti-Glare Screen Protector",
          "price": 14.99,
          "image": "/placeholder.svg?height=250&width=250"
        },
        {
          "id": 27,
          "name": "Smart Door Lock",
          "price": 129.99,
          "image": "/placeholder.svg?height=250&width=250"
        },
        {
          "id": 28,
          "name": "Wireless Charging Pad",
          "price": 49.99,
          "image": "/placeholder.svg?height=250&width=250"
        },
        {
          "id": 29,
          "name": "Ultra Slim Power Bank",
          "price": 32.99,
          "image": "/placeholder.svg?height=250&width=250"
        },
        {
          "id": 30,
          "name": "Electric Milk Frother",
          "price": 19.99,
          "image": "/placeholder.svg?height=250&width=250"
        },
        {
          "id": 31,
          "name": "Mini Projector",
          "price": 199.99,
          "image": "/placeholder.svg?height=250&width=250"
        },
        {
          "id": 32,
          "name": "WiFi Security Camera",
          "price": 89.99,
          "image": "/placeholder.svg?height=250&width=250"
        },
        {
          "id": 33,
          "name": "Wireless Barcode Scanner",
          "price": 59.99,
          "image": "/placeholder.svg?height=250&width=250"
        },
        {
          "id": 34,
          "name": "Multi-Port USB Hub",
          "price": 24.99,
          "image": "/placeholder.svg?height=250&width=250"
        },
        {
          "id": 35,
          "name": "Cordless Handheld Vacuum",
          "price": 69.99,
          "image": "/placeholder.svg?height=250&width=250"
        }
      ]); 
    }, [setProducts]);
    
    const [selected, setSelected]=useState<string[]>([]);

    const toggleSelection = (value: string) => {
      setSelected((prev) =>
        prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
      );
    };
    
    return(
      <>
      <Navbar/> 
      <div className="flex flex-col justify-center items-center font-sans min-h-screen overflow-x-hidden">
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
                    <Button 
                      variant="outline" 
                      className="w-[180px] flex flex-row justify-between items-center px-4 py-2 text-sm font-medium bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-100"
                    >
                      <span>Filters</span>
                      <ChevronDown className="text-gray-500" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="bg-white w-fit rounded-md border border-gray-200 shadow-md">
                    <div className="flex flex-col gap-2 p-2">
                      {["Clothes", "Electronics", "Kitchen Appliances", "Sports", "Beauty"].map((option) => (
                        <label key={option} className="flex items-center gap-2 text-sm text-gray-700">
                          <Checkbox checked={selected.includes(option)} onCheckedChange={() => toggleSelection(option)} />
                          {option}
                        </label>
                      ))}
                    </div>
                  </PopoverContent>
              </Popover>

              <Select value={sortOption} onValueChange={setSortOption}>
                <SelectTrigger className="w-[180px] px-4 py-2 text-sm font-medium bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-100">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 rounded-md shadow-md">
                  <SelectItem className="text-sm text-gray-700 px-3 py-2 hover:bg-gray-100" value="featured">Featured</SelectItem>
                  <SelectItem className="text-sm text-gray-700 px-3 py-2 hover:bg-gray-100" value="newest">Newest</SelectItem>
                  <SelectItem className="text-sm text-gray-700 px-3 py-2 hover:bg-gray-100" value="price-low">Price: Low to High</SelectItem>
                  <SelectItem className="text-sm text-gray-700 px-3 py-2 hover:bg-gray-100" value="price-high">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>


                </div>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 2xl:grid-cols-5 gap-6 my-8 px-5 md:px-10 xl:px-25 w-[100vw] ">
            {(products.slice(0,displayCount)).map((product) => ( // show 30 products
              <Link key={product.id} href={`/products/${product.id}`} className="">
                <Card className="overflow-hidden transition-all hover:shadow-lg pt-0">
                  <div className="relative h-[250px] w-full">
                    <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
                  </div>
                  <CardContent className="px-4">
                    <h3 className="font-semibold h-12 overflow-hidden text-ellipsis">{product.name}</h3>
                    <div className="flex flex-col 2xl:flex-row items-center justify-between mt-2 xl:mt-0">
                      <span className="font-bold ">${product.price.toFixed(2)}</span>
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

          <div className="flex justify-center mb-12 mt-6">
            <Button size={'xl'} disabled={displayCount>products.length} className="mx-auto bg-slate-600 hover:bg-slate-800" onClick={() => {setDisplayCount(displayCount + 15);}}>
              Load More
            </Button>
          </div>
        </div>
      </>
    );
}