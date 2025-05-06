/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import * as React from 'react';
import { useEffect, useState } from 'react';
import { Navbar } from "@/components/navbar";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Card, CardContent } from "@/components/ui/card";
import { ProductCard } from "@/components/productCard";
import { useProductStore } from "@/store/productStore";
import { getProducts } from '@/lib/api';
import Footer from '@/components/footer';
import { categories } from '@/app/constants';
import { Product } from '@/app/types';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const CATEGORY_COUNT=6;
const PRODUCT_COUNT=10;

export default function Home() {
  const products = useProductStore((state) => state.products);    
  const setProducts = useProductStore((state) => state.setProducts);
  const [banners, setBanners] = useState([
    "/hero.png",
    "/hero_2.png",
    "/hero_3.jpeg",
  ]);
  const [activeBannerIndex, setActiveBannerIndex] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  
  const pauseAutoplay = () => {
    setAutoplay(false);
    setTimeout(() => setAutoplay(true), 10000);
  }

  const nextBanner = () => {
    setActiveBannerIndex((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
  }

  const prevBanner = () => {
    setActiveBannerIndex((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
  }
  
  useEffect(() => {
    if (!autoplay) return;

    const interval = setInterval(() => {
      nextBanner();
    }, 5000)

    return () => clearInterval(interval)
  }, [activeBannerIndex, autoplay])


  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getProducts();
        setProducts(response.filter((product: Product)=>product.status==='active'));    {/* Filtering out the active products preferably in db because SQL query is more efficient */}
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);


  return (
    <div className="flex flex-col min-h-screen max-w-screen bg-white overflow-x-hidden">
      <Navbar />
      
      <div className="relative w-full overflow-hidden">
      <div className="w-screen aspect-[3/1] relative">
        <Image
          src={banners[activeBannerIndex] || "/placeholder.svg"}
          alt="Banner"
          fill
          priority
          className={`object-cover transition-opacity duration-300`}
        />

        <div className="absolute inset-0 flex items-center justify-between px-4">
          <button  className="text-white cursor-pointer rounded-full bg-background/80 backdrop-blur-sm transform transition-transform duration-150 ease-[cubic-bezier(0.4,0,0.2,1)] hover:scale-[1.03] hover:-translate-y-0.5"
            onClick={() => {
              pauseAutoplay();
              prevBanner();
            }}>
            <ChevronLeft size={38}/>
          </button>

          <button  className="text-white cursor-pointer rounded-full bg-background/80 backdrop-blur-sm pr-2 transform transition-transform duration-150 ease-[cubic-bezier(0.4,0,0.2,1)] hover:scale-[1.03] hover:-translate-y-0.5"
            onClick={() => {
              pauseAutoplay();
              nextBanner();
            }}>
            <ChevronRight size={38} />
          </button>
        </div>
        
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {banners.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full ${index === activeBannerIndex ? "bg-primary" : "bg-background/80"}`}
              onClick={() => {
                pauseAutoplay();
                setActiveBannerIndex(index);
              }}
            />
          ))}
        </div>
      </div>
    </div>

      <div className="category-shopping w-[100vw] flex flex-col justify-center items-center py-10">
        <div className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl pb-3 ">Shop by Category</div>
          <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed px-4">Check out our most popular items handpicked for you</p>
          <div className="flex flex-wrap gap-3 lg:gap-12 mt-8 w-[80vw] lg:w-[100vw] lg:flex lg:flex-wrap justify-center sm:px-10 lg:px-15 lg:mx-auto">
            {(categories.slice(0,CATEGORY_COUNT)).map((category) => ( // to limit to 6
              <Link key={category.id} href={`/products?category=${category.slug}`} className=''>
                <Card className="shrink-0 overflow-hidden transition-all hover:shadow-lg pt-0 bg-white w-full sm:w-[18vw] md:w-[31vw] xl:w-[23vw] 2xl:w-[21vw] cursor-pointer">

                  <div className="relative h-[200px] w-full">
                      <Image
                        src={category.image || "/placeholder.svg"}
                        alt={category.name}
                        fill
                        className="object-cover"
                      />
                  </div>
                  <CardContent className="px-4">
                    <h3 className="text-xl font-semibold h-7">{category.name}</h3>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        <div className="category-shopping w-[100vw] flex flex-col justify-center items-center pb-2">
            <div className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl pb-3">Featured Products</div>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">Choose from our most popular products</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 2xl:grid-cols-5 gap-6 my-8 px-5 md:px-10 xl:px-25 w-[100vw]">
        {products && products.length > 0 && (
          [...products] //to prevent permanent sorting cause spread operator prevents mutation
            .sort((a, b) => Number(b.rating) - Number(a.rating))
            .slice(0, PRODUCT_COUNT)
            .map((product) => (
              <ProductCard key={product.id} id={Number(product.id)} name={product.name} image={product.image} price={Number(product.price)} />
            ))
        )}
          </div>

          <div className="flex justify-center mb-24 mt-6">
            <Link href="/products">
              <Button size={'xl'} className="mx-auto bg-slate-600 hover:bg-slate-800 text-white font-[530]">
                View All Products
              </Button>
            </Link>
          </div>
          <Footer/>
    </div>
  );
}
