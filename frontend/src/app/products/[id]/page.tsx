/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import * as React from "react";
import { useState, useEffect, use } from "react";
import { useProductStore } from "@/store/productStore";
import { Navbar } from "@/components/navbar";
import Link from "next/link";
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronLeft, Star, Minus, Plus, ShoppingBag, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useParams, useRouter } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { toast } from 'react-hot-toast';
import { useCartStore } from "@/store/cartStore";
import { RequireAuth } from "@/components/requireAuth";
import Footer from "@/components/footer";
import { ProductCard } from "@/components/productCard";

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
    const [isTransitioning, setIsTransitioning] = useState(false);
    const productImages= new Array(PRODUCT_IMAGES_COUNT).fill(product?.image); // All images are the main one for now
    const incrementQuantity = () => setQuantity((prev) => prev + 1);
    const decrementQuantity = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

    const nextImage = () => {
      if (isTransitioning) return
      setIsTransitioning(true)
      setActiveImage((prev) => (prev === PRODUCT_IMAGES_COUNT - 1 ? 0 : prev + 1))
      setTimeout(() => setIsTransitioning(false), 300)
    }
  
    const prevImage = () => {
      if (isTransitioning) return
      setIsTransitioning(true)
      setActiveImage((prev) => (prev === 0 ? PRODUCT_IMAGES_COUNT - 1 : prev - 1))
      setTimeout(() => setIsTransitioning(false), 300)
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
        <div className="w-full lg:basis-[50%] max-w-md lg:max-w-xl">
          <div className="aspect-[1/1] rounded-lg overflow-hidden border relative max-w-full">
            <Image
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              fill
              className="object-cover"
            />
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
        <h2 className="text-2xl font-bold mb-6 px-6">You might also like</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 px-10">
          {products.filter((productItem)=>(productItem.category===product?.category)).slice(0,8).map((item) => (
            <ProductCard key={item.id} id={Number(item.id)} name={item.name} image={item.image} price={Number(item.price)} stock={item.stock} />
          ))}
        </div>
      </div>
      </div>
      <Footer/>
    </div>
  </RequireAuth>
  );
}
