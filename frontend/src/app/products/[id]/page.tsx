/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import * as React from "react";
import { useState, useEffect, use } from "react";
import { useProductStore } from "@/store/productStore";
import { Navbar } from "@/components/navbar";
import Link from "next/link";
import Image from "next/image";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Card, CardContent, CardFooter, CardHeader, CardDescription, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronLeft, Star, Minus, Plus, ShoppingBag, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useParams, useRouter } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { toast } from 'react-hot-toast';

export default function ProductPage() {
    const params= useParams();
    const id= params.id;
    const products = useProductStore((state)=>state.products);
    const product=products.find((product) => product.id === Number(id));
    console.log(products);
    console.log(product);
    const [quantity, setQuantity] = useState<number>(product?.quantity || 0);
    const [loading, setLoading] = useState<boolean>(true);
    const [wishList, setWishList] = useState<boolean>(false);
    const router = useRouter();

  if (!product) {
    return (
      <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
        <h1 className="text-2xl font-bold">Product not found</h1>
        <p className="text-muted-foreground mb-4">
          The product you&apos;re looking for doesn&apos;t exist.
        </p>
        <Link href="/products">
          <Button variant={"outline"}>Back to Products</Button>
        </Link>
      </div>
    );
};

  return(
    <div className="overflow-x-hidden min-h-screen">
      <Navbar />
      <Link href="/products" className="flex items-center text-sm mb-8 hover:underline m-6">
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Products
      </Link>
      <div className="container px-4 py-8 md:px-6 md:py-10">
        <div className="-mt-20 flex flex-col lg:flex-row p-8 justify-around items-center">
          <div className="w-1/2 lg:w-[70%] max-w-xl mx-auto lg:ml-10">
            <div className="sticky top-20 aspect-[1/1] rounded-lg overflow-hidden border">
              <Image
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                fill
                className="object-cover"  
              />
            </div>
          </div>
          <div className="w-1/2 mx-15 relative bottom-6">
            <h1 className="text-4xl font-bold pb-4">{product.name}</h1>
            <div className="flex items-center space-x-2 my-2">
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < product.rating
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                (10 reviews)
              </span>
            </div>
            <p className="text-2xl font-bold mt-4 mb-8"> ${product.price.toFixed(2)} </p>
            <p className="text-muted-foreground my-4">{product.shortDescription}</p>

            <Separator />

            <div className="flex gap-2">
              <div className="w-1/2">
                {quantity <= 0 ? (
                  <Button
                    size="lg"
                    className="w-full text-white bg-black"
                    variant="outline"
                    onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                      e.stopPropagation();
                      setQuantity(1);
                    }}
                  >
                    <ShoppingBag className="h-4 w-4 mr-2" />
                    Add to Cart
                  </Button>
                ) : (
                  <div
                    className="flex w-full items-center"
                    onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
                  >
                    <Button
                      variant="outline"
                      size="lg"
                      className="rounded-r-none w-1/3 "
                      onClick={() => setQuantity(quantity - 1)}
                      disabled={quantity <= 0}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <div className="w-1/3 h-10 flex justify-center items-center border-y text-sm ">
                      {quantity}
                    </div>
                    <Button
                      variant="outline"
                      size="lg"
                      className="rounded-l-none w-1/3 "
                      onClick={() => {
                        if (quantity >= 10) {
                          toast.error("Max 10 elements per customer");
                        } else {
                          setQuantity(quantity + 1);
                        }
                      }}
                      disabled={quantity >= 10}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                )}
              </div>

              <div className="w-1/2">
                <Button size="lg" className="w-full" variant="outline" onClick={()=>setWishList(!wishList)}>
                  <Heart className={`h-5 w-5 mr-2 ${wishList? "fill-red-500" : ""}`} />
                  {wishList? "Remove from WishList": "Add to Wishlist"}
                </Button>
              </div>
            </div>
            
            <div className="w-full">
              <Tabs defaultValue="description" className="mt-8 w-full">
                <TabsList className="grid grid-cols-2 w-full bg-gray-200 dark:bg-gray-800 rounded-full">
                  <TabsTrigger
                    value="description"
                    className="text-sm font-medium rounded-full transition-all
                              data-[state=active]:bg-white data-[state=active]:dark:bg-gray-900 
                              data-[state=active]:text-black data-[state=active]:dark:text-white
                              data-[state=active]:shadow-none"
                  >
                    Description
                  </TabsTrigger>
                  <TabsTrigger
                    value="details"
                    className="text-sm font-medium rounded-full transition-all
                              data-[state=active]:bg-white data-[state=active]:dark:bg-gray-900 
                              data-[state=active]:text-black data-[state=active]:dark:text-white
                              data-[state=active]:shadow-none"
                  >
                    Details
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="description" className="mt-4 text-sm text-muted-foreground">
                  <p className="p-1">{product.longDescription}</p>
                </TabsContent>

                <TabsContent value="details" className="mt-4 text-sm text-muted-foreground">
                  <div className="flex flex-col space-y-3">
                    {product.details && product.details.length > 0 ? (
                      product.details.map((detail, index) => (
                        <div key={index} className="flex flex-row items-center">
                          <p className="text-2xl">•</p>
                          <p className="my-1">{detail}</p>
                        </div>
                      ))
                    ) : (
                      <p>No details available</p>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
