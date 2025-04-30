/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import * as React from 'react';
import Fuse from 'fuse.js';
import { useState, useEffect, useRef } from 'react';
import { Navbar } from "@/components/navbar";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check, ShoppingBag, ArrowDown, ChevronDown, X } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuRadioItem, DropdownMenuTrigger, DropdownMenuRadioGroup, DropdownMenuLabel } from '@/components/ui/dropdown-menu';
import { RadioGroupItem } from '@/components/ui/radio-group';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useProductStore } from '@/store/productStore';
import { ProductCard } from '@/components/productCard';
import { useSearchStore } from '@/store/searchStore';
import { RadioGroup } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { DropdownMenuItem } from '@radix-ui/react-dropdown-menu';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import Footer from '@/components/footer';

interface Product {
  id: number
  name: string
  price: number
  image: string
  category: string
  shortDescription: string
  longDescription: string
  rating: number
  quantity: number
  details: string[]
}


const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const FILTERS=["Clothes", "Electronics", "Kitchen Appliances", "Sports", "Beauty"];
const SORT_BY=[ {name: "Rating", value:"rating"}, {name:"Newest", value:"newest"}, {name: "Price: Low to High", value:"price-low"}, {name: "Price: High to Low", value:"price-high"}];

export default function Products(){
    const [sortOption, setSortOption] = useState<string>();
    const [displayCount, setDisplayCount]=useState<number>(15);
    const [displayProducts, setDisplayProducts]= useState<Product[]>([]);
    const [loading, setLoading]= useState<boolean>(true);
    const initializedRef = useRef(false);
    const products= useProductStore((state) => state.products);
    const searchQuery= useSearchStore((state) => state.searchQuery);
    const router = useRouter();
    useEffect(() => {
      const load = async ()=>{
        await sleep(1000);
        setLoading(false);
      };
      load(); 
    }, [products]);


    useEffect(() => {
      setDisplayProducts(products);
    }, [products]);
    
    
    const [selected, setSelected]=useState<string[]>([]);

    const toggleSelection = (value: string) => {
      setSelected((prev) =>
        prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
      );
    };

    const handleSort=(sortMethod : string)=>{
      if( !sortMethod ){
        setDisplayProducts(products);
        return;
      }

      if (sortMethod === 'price-low') {
        setDisplayProducts((prev) => [...prev].sort((a, b) => a.price - b.price));
      } else if (sortMethod === 'price-high') {
        setDisplayProducts((prev) => [...prev].sort((a, b) => b.price - a.price));
      } else if (sortMethod === 'rating') {
        setDisplayProducts((prev) => [...prev].sort((a, b) => b.rating - a.rating));
      }
      else if (sortMethod === 'newest') {
        setDisplayProducts((prev) => [...prev].sort((a, b) => b.id - a.id));
      }
    }

    useEffect(() => {
      if (!sortOption) return;
      handleSort(sortOption);
    }, [sortOption]);


    useEffect(() => {
      let updatedProducts = [...products];
    
      // Semantic Search
      if (searchQuery.trim() !== '') {
        const fuse = new Fuse(updatedProducts, {
          keys: ['name', 'category', 'shortDescription'],
          threshold: 0.3,
        });
        const results = fuse.search(searchQuery);
        updatedProducts = results.map((result) => result.item);
      }
    
      if (selected.length > 0) {
        updatedProducts = updatedProducts.filter((product) =>
          selected.includes(product.category)
        );
      }
  
      if (sortOption === 'price-low') {
        updatedProducts.sort((a, b) => a.price - b.price);
      } else if (sortOption === 'price-high') {
        updatedProducts.sort((a, b) => b.price - a.price);
      } else if (sortOption === 'rating') {
        updatedProducts.sort((a, b) => b.rating - a.rating);
      } else if (sortOption === 'newest') {
        updatedProducts.sort((a, b) => b.id - a.id);
      }
    
      setDisplayProducts(updatedProducts);
    }, [selected, products, sortOption, searchQuery]);


    const searchParams = useSearchParams();


    useEffect(() => {
      if (initializedRef.current) return; // prevent re-running
    
      const categoryFromQuery = searchParams.get('category');
      if (categoryFromQuery && FILTERS.includes(categoryFromQuery)) {
        setSelected([categoryFromQuery]);
      }
    
      initializedRef.current = true;
    }, []);

    return(
      <div className='overflow-x-hidden min-h-screen bg-white'>
        <Navbar/> 
        <div className='flex flex-row justify-between items-center px-12 py-4 mt-5 mx-5 w-[100vw] overflow-x-hidden'>
            <h1 className='text-3xl font-bold'>All Products</h1>
            <div className='flex flex-row space-x-2'>
                {selected.map((item)=>(
                    <div key={item} className='bg-slate-100 px-2 py-1 rounded-md flex justify-center items-center'>
                        {item}
                        <Button variant={'ghost'} size={'xs'} className='ml-2' onClick={() => toggleSelection(item)}><X/></Button>
                    </div>
                ))}
                {selected.length>1 ? (
                    <Button variant={'outline'} size={'xs'} className='ml-2 px-2 py-1' onClick={() => setSelected([])}>Clear All <X/></Button>
                ) : null}
            </div>
            <div className='flex flex-row space-x-2'>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-[180px] bg-white flex justify-between items-center px-4 py-2 text-sm font-medium"
                  >
                    <span>{selected[0]? selected[0] : "Filter"}</span>
                    <ChevronDown className="ml-2 h-4 w-4 text-gray-500" />
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent className="w-48 bg-white flex flex-col gap-2 p-2">
                    {FILTERS.map((option) => (
                      <label key={option} className="flex items-center gap-2 text-sm text-gray-700">
                        <Checkbox checked={selected.includes(option)} onCheckedChange={() => toggleSelection(option)} />
                        {option}
                      </label>  
                    ))}
                </DropdownMenuContent>
              </DropdownMenu>

                <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                  variant="outline"
                  className="w-[180px] bg-white flex justify-between items-center px-4 py-2 text-sm font-medium"
                  >
                  <span>{sortOption ? SORT_BY.find(option => option.value === sortOption)?.name : 'Sort by'}</span>
                  <ChevronDown className="ml-2 h-4 w-4 text-gray-500" />
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent className="w-48 bg-white flex flex-col p-2 list-none">
                  {SORT_BY.map((option) => (
                    <DropdownMenuItem
                      key={option.value}
                      onSelect={()=>setSortOption(option.value)}
                      className="list-none text-sm text-gray-700 px-3 py-2 hover:bg-gray-100 rounded-md cursor-pointer"
                      style={{ listStyleType: 'none' }}>
                      {option.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
                </DropdownMenu>

            </div>
        </div>
            <div className="flex flex-col justify-center items-center font-sans overflow-x-hidden">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 2xl:grid-cols-5 gap-6 my-8 px-5 md:px-10 xl:px-25 w-[100vw] ">
                {loading ? (
                  Array.from({ length: displayCount }).map((_, i) => (
                    <Card key={i} className="overflow-hidden animate-pulse pt-0">
                      <div className="relative h-[250px] w-full bg-gray-200">
                      <Image
                            src={"/placeholder.svg"}
                            alt={"Loading..."}
                            fill
                            className="object-cover"
                          />
                      </div>
                      <CardContent className="px-4">
                        <div className="h-6 bg-gray-300 rounded mb-2" />
                        <div className="flex justify-between items-center mt-2">
                          <div className="h-4 w-16 bg-gray-300 rounded" />
                          <div className="h-8 w-24 bg-gray-300 rounded" />
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : displayProducts.length > 0 ? (
                  displayProducts.slice(0, displayCount).map((product) => (
                    <ProductCard key={product.id} id={product.id} name={product.name} image={product.image} price={Number(product.price)}/>
                  ))
                ) : (
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                    <p className="text-3xl font-bold text-gray-700 animate-pulse">🚧 Coming Soon!</p>
                    <p className="text-sm text-gray-500 mt-2">We&apos;ve got something amazing coming for you!</p>
                  </div>
                )}
            </div>

          <div className="flex justify-center mb-12 mt-6" hidden={displayCount>=displayProducts.length}>
            <Button size={'xl'} disabled={displayCount>=displayProducts.length} className="text-white mx-auto bg-slate-600 hover:bg-slate-800" onClick={() => {setDisplayCount(displayCount + 15);}}>
              Load More
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
}