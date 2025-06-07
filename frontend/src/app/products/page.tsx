/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import * as React from 'react';
import Fuse from 'fuse.js';
import Footer from '@/components/footer';
import Image from "next/image";
import { useState, useEffect, useRef } from 'react';
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronDown, X } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, } from '@/components/ui/dropdown-menu';
import { useProductStore } from '@/store/productStore';
import { ProductCard } from '@/components/productCard';
import { useSearchStore } from '@/store/searchStore';
import { Checkbox } from '@/components/ui/checkbox';
import { DropdownMenuItem } from '@radix-ui/react-dropdown-menu';
import { useSearchParams } from 'next/navigation';
import { Product } from "@/store/productStore"; 
import { categories } from '../constants';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const FILTERS=["Clothes", "Electronics", "Kitchen Appliances", "Sports", "Beauty"];
const SORT_BY=[ {name: "Rating", value:"rating"}, {name:"Newest", value:"newest"}, {name: "Price: Low to High", value:"price-low"}, {name: "Price: High to Low", value:"price-high"}];

export default function Products(){
    const [sortOption, setSortOption] = useState<string>();
    const [displayCount, setDisplayCount]=useState<number>(15);
    const [displayProducts, setDisplayProducts]= useState<Product[]>([]);
    const [selected, setSelected]=useState<string[]>([]);
    const [loading, setLoading]= useState<boolean>(true);
    const initializedRef = useRef(false);
    const products= useProductStore((state) => state.products);
    const searchQuery= useSearchStore((state) => state.searchQuery)
    const searchParams = useSearchParams();

    useEffect(() => {
      setLoading(false);
    }, [products]);


    useEffect(() => {
      setDisplayProducts(products);
    }, [products]);
    
    useEffect(() => {
      if (initializedRef.current || !searchParams) return;
    
      const categorySlugFromQuery = searchParams.get('category');
    
      if (categorySlugFromQuery) {
        const matchedCategory = categories.find(cat => cat.slug === categorySlugFromQuery);
    
        if (matchedCategory) {
          if (FILTERS.includes(matchedCategory.name)) {
            setSelected([matchedCategory.name]);
          } else {
            console.warn(`Category name "${matchedCategory.name}" for slug "${categorySlugFromQuery}" not found in FILTERS.`);
          }
        }
      }
      initializedRef.current = true;
    }, [searchParams]);

    const toggleSelection = (value: string) => {
      setSelected((prev) =>
        prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
      );
    };

    useEffect(() => {
      let updatedProducts = [...products];
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
  
      if (sortOption) {
        if (sortOption === 'price-low') {
          updatedProducts.sort((a, b) => Number(a.price) - Number(b.price));
        } else if (sortOption === 'price-high') {
          updatedProducts.sort((a, b) => Number(b.price) - Number(a.price));
        } else if (sortOption === 'rating') {
          updatedProducts.sort((a, b) => Number(b.rating) - Number(a.rating));
        } else if (sortOption === 'newest') {
          updatedProducts.sort((a, b) => Number(b.id) - Number(a.id));
        }
      }
    
      setDisplayProducts(updatedProducts);
    }, [selected, products, sortOption, searchQuery]);

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
                    <ProductCard key={product.id} id={Number(product.id)} name={product.name} image={product.image} price={Number(product.price)} stock={product.stock}/>
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