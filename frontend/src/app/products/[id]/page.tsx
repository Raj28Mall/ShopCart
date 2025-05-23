/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import * as React from "react";
import { useState, useEffect, use, useRef } from "react";
import { useProductStore } from "@/store/productStore";
import { Navbar } from "@/components/navbar";
import Link from "next/link";
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronLeft, Star, Minus, Plus, ShoppingBag, Heart, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useParams, useRouter } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { toast } from 'react-hot-toast';
import { useCartStore } from "@/store/cartStore";
import { RequireAuth } from "@/components/requireAuth";
import Footer from "@/components/footer";
import { zoomFactor } from "@/app/constants";
import { Badge } from "@/components/ui/badge";

const PRODUCT_IMAGES_COUNT=5; //remeber to make this dynamic according to images fetched from backend

export default function ProductPage() {
    const params= useParams();
    const id= params.id;
    const products = useProductStore((state)=>state.products);
    const product=products.find((product) => product.id.toString() === (id)?.toString());
    const cartItems = useCartStore((state) => state.cartItems);
    const setCartItems = useCartStore((state) => state.setCartItems);
    const [quantity, setQuantity] = useState<number>(cartItems.find((item)=>item.id===Number(id))?.quantity || 0);
    const [productNotFound, setProductNotFound] = useState<boolean>(false);
    const [wishList, setWishList] = useState<boolean>(false);
    const [activeImage, setActiveImage] = useState(0);
    const productImages= new Array(PRODUCT_IMAGES_COUNT).fill(product?.image); // All images are the main one for now
    const incrementQuantity = () => setQuantity((prev) => prev + 1);
    const decrementQuantity = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

    const [isZoomed, setIsZoomed] = useState(false)
    const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 })
    const imageContainerRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageContainerRef.current) return

    const { left, top, width, height } = imageContainerRef.current.getBoundingClientRect()
    const x = (e.clientX - left) / width
    const y = (e.clientY - top) / height

    setZoomPosition({ x, y })
  }

  const handleMouseEnter = () => setIsZoomed(true)
  const handleMouseLeave = () => setIsZoomed(false)

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!imageContainerRef.current || e.touches.length === 0) return

    const touch = e.touches[0]
    const { left, top, width, height } = imageContainerRef.current.getBoundingClientRect()
    const x = (touch.clientX - left) / width
    const y = (touch.clientY - top) / height

    setZoomPosition({ x, y })
  }

  const handleTouchStart = () => setIsZoomed(true)
  const handleTouchEnd = () => setIsZoomed(false)

    const nextImage = () => {
      setActiveImage((prev) => (prev === PRODUCT_IMAGES_COUNT - 1 ? 0 : prev + 1))
    }
  
    const prevImage = () => {
      setActiveImage((prev) => (prev === 0 ? PRODUCT_IMAGES_COUNT - 1 : prev - 1))
    }
    
    setTimeout(() => {
      const waitForItem = async ()=>{
        await new Promise((resolve)=> setTimeout(resolve, 1000));
        setProductNotFound(true);
      }
      waitForItem();
    }, []);

    const handleAddToCart = () => {
      setQuantity(quantity + 1);
      const existingItem = cartItems.find((item) => item.id === Number(id));
      let newItems;
      if (existingItem) {
          newItems = cartItems.map(item =>
              item.id === Number(id) ? { ...item, quantity: item.quantity + 1 } : item
          );
      } else {
          newItems = [...cartItems, { "id": Number(id), quantity: 1 }];
      }
      setCartItems(newItems);
  };

    const handleRemoveFromCart = () => {
        const existingItem = cartItems.find((item) => item.id === Number(id));
        if (!existingItem) return;
    
        const newItems = existingItem.quantity === 1
            ? cartItems.filter(item => item.id !== Number(id))
            : cartItems.map(item =>
                item.id === Number(id) ? { ...item, quantity: item.quantity - 1 } : item
        );
    
        setCartItems(newItems);
        if (quantity > 1) {
            setQuantity(quantity - 1);
        } else {
            setQuantity(0); 
        }
    };

  if (!product && productNotFound) {
    return (
      <>
      <Navbar/>
      <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
        <h1 className="text-2xl font-bold">Product not found</h1>
        <p className="text-muted-foreground mb-4">
          The product you&apos;re looking for doesn&apos;t exist.
        </p>
        <Link href="/products">
          <Button variant={"outline"}>Back to Products</Button>
        </Link>
      </div>
      </>
    );
};

  return(
    <RequireAuth>
    <div className="overflow-x-hidden min-h-screen">
      <Navbar/>
      <Link href="/products" className="flex items-center text-sm mb-8 hover:underline m-6">
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Products
      </Link>
      <div className="container px-4 py-8 md:px-6 md:py-10">
        {product? 
        <div className="-mt-15 lg:-mt-24 flex flex-col lg:gap-x-16 lg:flex-row flex-wrap gap-y-10 items-start justify-center p-4 sm:p-6 md:p-8 lg:p-10">
        <div ref={imageContainerRef}
         className="w-full lg:basis-[50%] max-w-md lg:max-w-xl cursor-zoom-in"
         onMouseMove={handleMouseMove}
         onMouseEnter={handleMouseEnter}
         onMouseLeave={handleMouseLeave}
         onTouchMove={handleTouchMove}
         onTouchStart={handleTouchStart}
         onTouchEnd={handleTouchEnd}>

          <div className="aspect-[1/1] rounded-lg overflow-hidden border relative max-w-full">
            <Image
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              fill
              className="object-cover"
            />

            {isZoomed && (
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  backgroundImage: `url(${product.image})`,
                  backgroundPosition: `${zoomPosition.x * 100}% ${zoomPosition.y * 100}%`,
                  backgroundSize: `${zoomFactor * 100}%`,
                  backgroundRepeat: "no-repeat",
                }}
              />
            )}
          </div>
        </div>

        <div className="w-full lg:basis-[45%] max-w-2xl">
          <h1 className="text-4xl font-bold pb-4">{product.name}</h1>
          <div className="flex items-center space-x-2 my-2">
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${
                    i < Number(product.rating)
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">
              {Number(product.rating)<=0 ? "(No reviews yet)" : "(10 reviews)"}
            </span>
          </div>
          <p className="text-2xl font-bold mt-4 mb-8">₹ {Number(product.price).toFixed(2)} </p>
          <p className="text-muted-foreground my-4">{product.shortDescription}</p>

          <Separator />

          <div className="flex gap-2">
            <div className="w-1/2">
              {quantity <= 0 ? (
                <Button
                  size="lg"
                  className="w-full text-white bg-black"
                  variant="outline"
                  onClick={(e: React.MouseEvent<HTMLButtonElement>) => { e.stopPropagation(); handleAddToCart();}}>
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  Add to Cart 
                </Button>
              ) : (
                <div
                  className="flex w-full items-center"
                  onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}>
                  <Button
                    variant="outline"
                    size="lg"
                    className="rounded-r-none w-1/3 "
                    onClick={() => handleRemoveFromCart()}
                    disabled={quantity <= 0}>
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
                        handleAddToCart();
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
              <TabsList className="grid grid-cols-2 w-full bg-gray-200 rounded-full">
                <TabsTrigger
                  value="description"
                  className="text-sm font-medium rounded-full transition-all  data-[state=active]:bg-white data-[state=active]:text-black  data-[state=active]:shadow-none">
                  Description
                </TabsTrigger>
                <TabsTrigger
                  value="details"
                  className="text-sm font-medium rounded-full transition-all  data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-none">
                  Details
                </TabsTrigger>
              </TabsList>

              <TabsContent value="description" className="mt-4 text-sm">
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
      </div>: 
            <div className="-mt-15 lg:-mt-24 flex flex-col lg:gap-x-16 lg:flex-row flex-wrap gap-y-10 items-start justify-center p-4 sm:p-6 md:p-8 lg:p-10 animate-pulse">
            <div className="w-full lg:basis-[50%] max-w-md lg:max-w-xl">
              <div className="aspect-[1/1] rounded-lg overflow-hidden border relative max-w-full bg-gray-200">
                <Image
                  src="/placeholder.svg"
                  alt="Loading image"
                  fill
                  className="object-cover opacity-30"
                />
              </div>
            </div>
          
            <div className="w-full lg:basis-[45%] max-w-2xl space-y-4">
              <div className="h-10 w-3/4 bg-gray-300 rounded mb-5" />
              
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-5 w-5 bg-gray-300 rounded" />
                  ))}
                </div>
                <div className="h-4 w-18 bg-gray-300 rounded" />
              </div>
          
              <div className="h-8 w-24 bg-gray-300 rounded mb-10" /> 
              <div className="h-4 w-full bg-gray-300 rounded" />

              <div className="flex space-x-2">
                <div className="h-10 w-1/2 bg-gray-300 rounded-md" />
                <div className="h-10 w-1/2 bg-gray-300 rounded-md" />
              </div>
              
              <div className="border-t my-4" />
          
              <div className="flex">
                <div className="w-full h-8 bg-gray-300 rounded-xl" /> 
              </div>
          
              <div className="mt-8 space-y-4">
                <div className="h-4 w-full bg-gray-300 rounded" />
                <div className="h-4 w-full bg-gray-300 rounded" />
                <div className="h-4 w-full bg-gray-300 rounded" />
                <div className="h-4 w-full bg-gray-300 rounded" />
                <div className="h-4 w-full bg-gray-300 rounded" />
                <div className="h-4 w-3/4 bg-gray-300 rounded" />
              </div>
            </div>
          </div>
    }

      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-6">You might also like</h2>
        <div className="relative">
          <Button
            variant="outline"
            size="icon"
            className="absolute left-0 top-1/2 z-10 rounded-full bg-background/80 backdrop-blur-sm shadow-md hidden md:flex"
            onClick={() => {
              const container = document.getElementById("related-products-container")
              if (container) {
                container.scrollBy({ left: -300, behavior: "smooth" })
              }
            }}>
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <div
            id="related-products-container"
            className="flex overflow-x-auto pb-4 space-x-4 scrollbar-hide snap-x snap-mandatory"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {products.filter((item)=>item.category==product?.category).map((product) => (
              <Link key={product.id} href={`/products/${product.id}`} className="relative flex-none w-[280px] snap-start">
                <Card className="overflow-hidden transition-all hover:shadow-lg h-full pt-0">
                  <div className="relative h-[200px] w-full">
                    <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover" loading="lazy" 
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
                  </div>


                  {(Number(product.id)%4===0 || Number(product.id)%3===0)?
                    <div className="absolute top-2 left-2">
                      <Badge className="bg-blue-500 hover:bg-blue-600">New</Badge>
                  </div>
                  : ""}
                  
                  {(Number(product.id)%2===0)?
                    <div className="absolute top-2 right-2">
                      <Badge className="text-white bg-red-500 hover:bg-red-600">15% OFF</Badge>
                  </div>:""}
                    
                  <CardContent className="p-4">
                    <h3 className="font-semibold">{product.name}</h3>
                    <div className="flex items-center justify-between mt-2">
                      <span className="font-bold">${Number(product.price).toFixed(2)}</span>
                      <Button size="sm" variant="outline">
                        <ShoppingBag className="h-4 w-4 mr-2" />
                        Add to Cart
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </Link>
          ))}
          </div>

          <Button
            variant="outline"
            size="icon"
            className="absolute right-0 top-1/2 z-10 rounded-full bg-background/80 backdrop-blur-sm shadow-md hidden md:flex"
            onClick={() => {
              const container = document.getElementById("related-products-container")
              if (container) {
                container.scrollBy({ left: 300, behavior: "smooth" })
              }
            }}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      </div>
      <Footer/>
    </div>
  </RequireAuth>
  );
}
