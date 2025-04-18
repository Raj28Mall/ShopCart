"use client";
import * as React from 'react';
import { useEffect } from 'react';
import { Navbar } from "@/components/navbar";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Card, CardContent } from "@/components/ui/card";
import { ProductCard } from "@/components/productCard";
import { useProductStore } from "@/store/productStore";
import { getProducts } from '@/lib/api';

const CATEGORY_COUNT=6;
const PRODUCT_COUNT=10;

export default function Home() {
  const products = useProductStore((state) => state.products);    
  const setProducts = useProductStore((state) => state.setProducts);
  const categories = [
    {
      id: 1,
      name: "Clothing",
      slug: "clothing",
      image: "/products/clothes/clothing.jpg",
    },
    {
      id: 2,
      name: "Electronics",
      slug: "electronics",
      image: "/products/electronics/electronics.jpg",
    },
    {
      id: 3,
      name: "Home & Kitchen",
      slug: "home-kitchen",
      image: "/products/kitchen/kitchen.avif",
    },
    {
      id: 4,
      name: "Sports",
      slug: "sports",
      image: "/products/sports/sports.avif",
    },
    {
      id: 5,
      name: "Beauty",
      slug: "beauty",
      image: "/products/beauty/beauty.jpeg",
    },
  ];
  
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getProducts();
        setProducts(response);
        console.log(response);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);


  return (
    <div className="flex flex-col min-h-screen max-w-screen bg-white overflow-x-hidden">
      <Navbar />
      <AspectRatio className="" ratio={1920/650}>
        <Image src="/hero.png" alt="Hero Image" fill priority={true}/>
      </AspectRatio>
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
            .sort((a, b) => b.rating - a.rating)
            .slice(0, PRODUCT_COUNT)
            .map((product) => (
              <ProductCard key={product.id} id={product.id} name={product.name} image={product.image} price={Number(product.price)} />
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
    </div>
  );
}
