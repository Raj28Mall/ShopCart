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
interface Product {
  id: number
  name: string
  price: number
  image: string
  category: string
  description: string
  rating: number
  // reviews: number
  inStock: boolean
  details: string
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const FILTERS=["Clothes", "Electronics", "Kitchen Appliances", "Sports", "Beauty"];
const SORT_BY=[ {name: "Rating", value:"rating"}, {name:"Newest", value:"newest"}, {name: "Price: Low to High", value:"price-low"}, {name: "Price: High to Low", value:"price-high"}];

export default function Products(){
    const [sortOption, setSortOption] = useState<string>();
    const [displayCount, setDisplayCount]=useState<number>(15);
    const products= useProductStore((state) => state.products);
    const setProducts= useProductStore((state) => state.setProducts);
    const [displayProducts, setDisplayProducts]= useState<Product[]>([]);
    const [loading, setLoading]= useState<boolean>(true);

    useEffect(() => {
      const load = async ()=>{
        await sleep(500);
        setLoading(false);
        setProducts([
          {
            id: 1,
            name: "Premium Cotton T-Shirt",
            price: 29.99,
            image: "/placeholder.svg?height=250&width=250",
            category: "Clothes",
            rating: 4.4,
            description: "Soft, breathable cotton tee for everyday wear.",
            inStock: true,
            details: "Made from 100% premium cotton. Machine washable. Available in multiple colors."
          },
          {
            id: 2,
            name: "Wireless Headphones",
            price: 129.99,
            image: "/placeholder.svg?height=250&width=250",
            category: "Electronics",
            rating: 4.6,
            description: "High-fidelity sound with noise isolation.",
            inStock: true,
            details: "Bluetooth 5.0, 20-hour battery, foldable design, built-in mic for calls."
          },
          {
            id: 3,
            name: "Ceramic Coffee Mug",
            price: 19.99,
            image: "/placeholder.svg?height=250&width=250",
            category: "Kitchen Appliances",
            rating: 4.2,
            description: "Minimalist mug for hot and cold beverages.",
            inStock: true,
            details: "12oz capacity, microwave and dishwasher safe. Matte ceramic finish."
          },
          {
            id: 4,
            name: "Eco-Friendly Notebook",
            price: 9.99,
            image: "/placeholder.svg?height=250&width=250",
            category: "Electronics",
            rating: 4.1,
            description: "Recyclable notebook with smooth pages.",
            inStock: false,
            details: "80 ruled pages. Made with recycled paper. A5 size."
          },
          {
            id: 5,
            name: "Bluetooth Speaker",
            price: 49.99,
            image: "/placeholder.svg?height=250&width=250",
            category: "Electronics",
            rating: 4.5,
            description: "Loud, portable sound with deep bass.",
            inStock: true,
            details: "10W output, water-resistant, 12-hour playtime, supports TWS pairing."
          },
          {
            id: 6,
            name: "Running Shoes",
            price: 89.99,
            image: "/placeholder.svg?height=250&width=250",
            category: "Sports",
            rating: 4.3,
            description: "Lightweight and breathable athletic shoes.",
            inStock: true,
            details: "Mesh upper, EVA sole, arch support. Ideal for daily runs and training."
          },
          {
            id: 7,
            name: "Stainless Steel Water Bottle",
            price: 24.99,
            image: "/placeholder.svg?height=250&width=250",
            category: "Kitchen Appliances",
            rating: 4.7,
            description: "Keeps drinks cold for 24 hrs, hot for 12 hrs.",
            inStock: true,
            details: "Double-wall insulated, BPA-free, 750ml capacity, leak-proof lid."
          },
          {
            id: 8,
            name: "Minimalist Wristwatch",
            price: 199.99,
            image: "/placeholder.svg?height=250&width=250",
            category: "Electronics",
            rating: 4.5,
            description: "Elegant and simple analog wristwatch.",
            inStock: false,
            details: "Stainless steel body, leather strap, water resistant, quartz movement."
          },
          {
            id: 9,
            name: "Laptop Stand",
            price: 39.99,
            image: "/placeholder.svg?height=250&width=250",
            category: "Electronics",
            rating: 4.4,
            description: "Ergonomic stand for better posture.",
            inStock: true,
            details: "Aluminum alloy, adjustable height, supports up to 17\" laptops."
          },
          {
            id: 10,
            name: "Desk Organizer Set",
            price: 17.99,
            image: "/placeholder.svg?height=250&width=250",
            category: "Electronics",
            rating: 4.2,
            description: "Declutter your workspace in style.",
            inStock: true,
            details: "5-piece set, includes pen holder, tray, sticky note box, and more."
          },
          {
            id: 11,
            name: "LED Desk Lamp",
            price: 34.99,
            image: "/placeholder.svg?height=250&width=250",
            category: "Electronics",
            rating: 4.6,
            description: "Eye-friendly lighting with adjustable brightness.",
            inStock: true,
            details: "Touch controls, 3 color modes, USB charging port, foldable design."
          },
          {
            id: 12,
            name: "Smartphone Tripod",
            price: 22.49,
            image: "/placeholder.svg?height=250&width=250",
            category: "Electronics",
            rating: 4.3,
            description: "Flexible tripod for mobile photography.",
            inStock: true,
            details: "360° ball head, remote shutter, compatible with all phones."
          },
          {
            id: 13,
            name: "Noise-Cancelling Earbuds",
            price: 79.99,
            image: "/placeholder.svg?height=250&width=250",
            category: "Electronics",
            rating: 4.5,
            description: "Compact buds with immersive sound.",
            inStock: false,
            details: "ANC, 8-hour playtime, fast charging, sweat-proof design."
          },
          {
            id: 14,
            name: "Portable Charger 10000mAh",
            price: 29.49,
            image: "/placeholder.svg?height=250&width=250",
            category: "Electronics",
            rating: 4.4,
            description: "Charge your devices on the go.",
            inStock: true,
            details: "Dual USB output, slim design, LED battery indicator."
          },
          {
            id: 15,
            name: "Leather Wallet",
            price: 39.99,
            image: "/placeholder.svg?height=250&width=250",
            category: "Clothes",
            rating: 4.2,
            description: "Stylish wallet with multiple card slots.",
            inStock: true,
            details: "Genuine leather, RFID blocking, 8 card slots + coin pocket."
          },
          {
            "id": 16,
            "name": "Gaming Mouse",
            "price": 59.99,
            "image": "/placeholder.svg?height=250&width=250",
            "category": "Electronics",
            "rating": 4.6,
            "description": "High precision gaming mouse with RGB lighting.",
            "inStock": true,
            "details": "Ergonomic design, 16000 DPI sensor, 6 programmable buttons, ideal for FPS games."
          },
          {
            "id": 17,
            "name": "Wireless Mechanical Keyboard",
            "price": 109.99,
            "image": "/placeholder.svg?height=250&width=250",
            "category": "Electronics",
            "rating": 4.8,
            "description": "Tactile wireless keyboard with RGB lighting.",
            "inStock": true,
            "details": "Customizable keys, Bluetooth and USB-C connectivity, perfect for productivity and gaming."
          },
          {
            "id": 18,
            "name": "4K Webcam",
            "price": 89.99,
            "image": "/placeholder.svg?height=250&width=250",
            "category": "Electronics",
            "rating": 4.5,
            "description": "Ultra HD webcam for streaming and conferencing.",
            "inStock": false,
            "details": "4K resolution, dual noise-canceling mics, wide-angle lens, USB plug-and-play."
          },
          {
            "id": 19,
            "name": "Ergonomic Office Chair",
            "price": 249.99,
            "image": "/placeholder.svg?height=250&width=250",
            "category": "Electronics",
            "rating": 4.7,
            "description": "Mesh-back chair with lumbar support.",
            "inStock": true,
            "details": "Adjustable height, headrest, and armrests, promotes good posture for long work sessions."
          },
          {
            "id": 20,
            "name": "Smart LED Light Strips",
            "price": 34.99,
            "image": "/placeholder.svg?height=250&width=250",
            "category": "Electronics",
            "rating": 4.3,
            "description": "Voice-controlled RGB light strips.",
            "inStock": true,
            "details": "Compatible with Alexa/Google, 16M colors, music sync, app-controlled."
          },
          {
            "id": 21,
            "name": "USB-C Docking Station",
            "price": 79.99,
            "image": "/placeholder.svg?height=250&width=250",
            "category": "Electronics",
            "rating": 4.4,
            "description": "Multi-port hub for laptops.",
            "inStock": true,
            "details": "Includes HDMI, USB-A/C, Ethernet, SD card reader; ideal for work-from-home setups."
          },
          {
            "id": 22,
            "name": "Adjustable Standing Desk",
            "price": 399.99,
            "image": "/placeholder.svg?height=250&width=250",
            "category": "Electronics",
            "rating": 4.8,
            "description": "Electric height-adjustable desk.",
            "inStock": true,
            "details": "Programmable presets, smooth motor lift, enhances productivity and posture."
          },
          {
            "id": 23,
            "name": "Noise-Isolating Microphone",
            "price": 119.99,
            "image": "/placeholder.svg?height=250&width=250",
            "category": "Electronics",
            "rating": 4.6,
            "description": "Pro-grade mic for streaming and calls.",
            "inStock": true,
            "details": "Cardioid pattern, shock mount, pop filter included, USB plug-and-play."
          },
          {
            "id": 24,
            "name": "Foldable Laptop Stand",
            "price": 27.99,
            "image": "/placeholder.svg?height=250&width=250",
            "category": "Electronics",
            "rating": 4.4,
            "description": "Portable stand for laptops up to 17 inches.",
            "inStock": true,
            "details": "Adjustable angles, aluminum build, improves ergonomics and cooling."
          },
          {
            "id": 25,
            "name": "Fitness Tracker Watch",
            "price": 79.99,
            "image": "/placeholder.svg?height=250&width=250",
            "category": "Sports",
            "rating": 4.5,
            "description": "All-day fitness and health tracking.",
            "inStock": true,
            "details": "Heart rate, sleep monitoring, waterproof, long battery life, syncs with mobile apps."
          },
          {
            "id": 26,
            "name": "Anti-Glare Screen Protector",
            "price": 14.99,
            "image": "/placeholder.svg?height=250&width=250",
            "category": "Electronics",
            "rating": 4.2,
            "description": "Matte film reduces reflections on screens.",
            "inStock": true,
            "details": "Scratch-resistant, fingerprint-proof, easy installation for laptops/tablets."
          },
          {
            "id": 27,
            "name": "Smart Door Lock",
            "price": 129.99,
            "image": "/placeholder.svg?height=250&width=250",
            "category": "Electronics",
            "rating": 4.4,
            "description": "Keyless smart lock with app control.",
            "inStock": true,
            "details": "Supports passcodes, remote access, activity logs, integrates with smart home systems."
          },
          {
            "id": 28,
            "name": "Wireless Charging Pad",
            "price": 49.99,
            "image": "/placeholder.svg?height=250&width=250",
            "category": "Electronics",
            "rating": 4.3,
            "description": "Fast wireless charger with sleek design.",
            "inStock": true,
            "details": "Qi-certified, supports 15W fast charging, anti-slip base, LED status indicator."
          },
          {
            "id": 29,
            "name": "Ultra Slim Power Bank",
            "price": 32.99,
            "image": "/placeholder.svg?height=250&width=250",
            "category": "Electronics",
            "rating": 4.5,
            "description": "Compact 10000mAh power bank.",
            "inStock": false,
            "details": "Dual output, USB-C and micro-USB input, LED display, airline safe."
          },
          {
            "id": 30,
            "name": "Electric Milk Frother",
            "price": 19.99,
            "image": "/placeholder.svg?height=250&width=250",
            "category": "Kitchen Appliances",
            "rating": 4.6,
            "description": "Make café-style foam at home.",
            "inStock": true,
            "details": "One-button operation, stainless steel whisk, ideal for lattes and cappuccinos."
          },
          {
            "id": 31,
            "name": "Mini Projector",
            "price": 199.99,
            "image": "/placeholder.svg?height=250&width=250",
            "category": "Electronics",
            "rating": 4.3,
            "description": "Compact projector for movies and gaming.",
            "inStock": true,
            "details": "HD resolution, HDMI/USB input, portable design, built-in speakers."
          },
          {
            "id": 32,
            "name": "WiFi Security Camera",
            "price": 89.99,
            "image": "/placeholder.svg?height=250&width=250",
            "category": "Electronics",
            "rating": 4.4,
            "description": "Smart surveillance for home security.",
            "inStock": true,
            "details": "1080p recording, motion detection, two-way audio, app access."
          },
          {
            "id": 33,
            "name": "Wireless Barcode Scanner",
            "price": 59.99,
            "image": "/placeholder.svg?height=250&width=250",
            "category": "Electronics",
            "rating": 4.1,
            "description": "Bluetooth barcode scanner for POS and inventory.",
            "inStock": true,
            "details": "Supports 1D/2D codes, long battery life, plug-and-play USB receiver."
          },
          {
            "id": 34,
            "name": "Multi-Port USB Hub",
            "price": 24.99,
            "image": "/placeholder.svg?height=250&width=250",
            "category": "Electronics",
            "rating": 4.4,
            "description": "Expand your laptop's connectivity.",
            "inStock": true,
            "details": "4 USB 3.0 ports, compact aluminum body, ideal for accessories and storage."
          },
          {
            "id": 35,
            "name": "Cordless Handheld Vacuum",
            "price": 69.99,
            "image": "/placeholder.svg?height=250&width=250",
            "category": "Kitchen Appliances",
            "rating": 4.3,
            "description": "Portable vacuum cleaner for home and car.",
            "inStock": true,
            "details": "Rechargeable battery, HEPA filter, lightweight, great for quick cleanups."
          }
        ]);
      };
      load();
    }, []);


    useEffect(() => {
      console.log(products.slice(0,5));
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
      let updatedProducts= [];
      updatedProducts = products.filter((product) => {
        if (selected.length === 0) return true; // no filters selected, show all products
        return selected.includes(product.category);
      });
      
      if( !sortOption ){
        setDisplayProducts(updatedProducts);
        return;
      }

      if (sortOption === 'price-low') {
        setDisplayProducts(updatedProducts.sort((a, b) => a.price - b.price));
      } else if (sortOption === 'price-high') {
        setDisplayProducts(updatedProducts.sort((a, b) => b.price - a.price));
      } else if (sortOption === 'rating') {
        setDisplayProducts(updatedProducts.sort((a, b) => b.rating - a.rating));
      }
      else if (sortOption === 'newest') {
        setDisplayProducts(updatedProducts.sort((a, b) => b.id - a.id));
      }

    }, [selected, products, sortOption]);

    
    return(
      <div className='overflow-x-hidden min-h-screen'>
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
                    {FILTERS.map((option) => (
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
                {SORT_BY.map((option) => (
                  <SelectItem key={option.value} className="text-sm text-gray-700 px-3 py-2 hover:bg-gray-100" value={option.value} onClick={()=> setSortOption(option.value)}>
                    {option.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            </div>
        </div>
          <div className="flex flex-col justify-center items-center font-sans overflow-x-hidden">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 2xl:grid-cols-5 gap-6 my-8 px-5 md:px-10 xl:px-25 w-[100vw] ">
              {loading ? (
                // Show loading placeholders (you can show 6 or however many you want)
                Array.from({ length: 15 }).map((_, i) => (
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
                // Show actual products
                displayProducts.slice(0, displayCount).map((product) => (
                  <Link key={product.id} href={`/products/${product.id}`}>
                    <Card className="overflow-hidden transition-all hover:shadow-lg pt-0">
                      <div className="relative h-[250px] w-full">
                        <Image
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <CardContent className="px-4">
                        <h3 className="font-semibold h-12 overflow-hidden text-ellipsis">{product.name}</h3>
                        <div className="flex flex-col 2xl:flex-row items-center justify-between mt-2 xl:mt-0">
                          <span className="font-bold">${product.price.toFixed(2)}</span>
                          <Button size="sm" variant="outline">
                            <ShoppingBag className="h-4 w-4 mr-2" />
                            Add to Cart
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))
              ) : (
                // Show “Coming Soon”
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
      </div>
    );
}