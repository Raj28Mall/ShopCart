"use client";
import { Navbar } from "@/components/navbar";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingBag } from "lucide-react";
import { ProductCard } from "@/components/productCard";
import { useProductStore } from "@/store/productStore";

export default function Home() {
  const categories = [
    {
      id: 1,
      name: "Clothing",
      slug: "clothing",
      image: "/placeholder.svg?height=200&width=400",
    },
    {
      id: 2,
      name: "Electronics",
      slug: "electronics",
      image: "/placeholder.svg?height=200&width=400",
    },
    {
      id: 3,
      name: "Home & Kitchen",
      slug: "home-kitchen",
      image: "/placeholder.svg?height=200&width=400",
    },
    {
      id: 4,
      name: "Sports",
      slug: "sports",
      image: "/placeholder.svg?height=200&width=400",
    },
    {
      id: 5,
      name: "Beauty",
      slug: "beauty",
      image: "/placeholder.svg?height=200&width=400",
    },
  ];
  
  // const products = useProductStore((state) => state.products);       //for future use of the global zustand state
  // const setProducts = useProductStore((state) => state.setProducts);

  const products =[
    {
      id: 1,
      name: "Premium Cotton T-Shirt",
      price: 29.99,
      image: "/placeholder.svg?height=250&width=250",
      category: "Clothes",
      rating: 4.4,
      description: "Soft, breathable cotton tee for everyday wear.",
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
      "details": "Rechargeable battery, HEPA filter, lightweight, great for quick cleanups."
    }
  ];
  

  return (
    <div className="flex flex-col min-h-screen max-w-screen bg-slate-100 overflow-x-hidden">
      <Navbar />
      <AspectRatio className="" ratio={1920/650}>
        <Image src="/hero.png" alt="Hero Image" fill priority={true}/>
      </AspectRatio>
      <div className="category-shopping w-[100vw] flex flex-col justify-center items-center py-10">
        <div className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl pb-3 ">Shop by Category</div>
          <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed px-4">Check out our most popular items handpicked for you</p>
          <div className="grid grid-cols-2 gap-12 mt-8 w-[70vw] lg:w-[100vw] lg:flex lg:flex-wrap lg:justify-center px-3 lg:px-15 mx-auto">
            {(categories.slice(0,6)).map((category) => ( // to limit to 6
              <Link key={category.id} href={`/products?category=${category.slug}`}>
                <Card className="overflow-hidden transition-all hover:shadow-lg pt-0 w-[21vw]">
                  <div className="relative h-[200px] w-full">
                      <Image
                        src={category.image || "/placeholder.svg"}
                        alt={category.name}
                        fill
                        className="object-cover"
                      />
                  </div>
                  <CardContent className="px-4">
                    <h3 className="text-xl font-semibold h-10">{category.name}</h3>
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
            {((products.sort((a,b)=>b.rating-a.rating)).slice(0,15)).map((product) => (
              <ProductCard key={product.id} id={product.id} name={product.name} image={product.image} price={product.price} quantity={0}/>
            ))}
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
