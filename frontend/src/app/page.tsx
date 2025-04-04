"use client";
import { Navbar } from "@/components/navbar";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingBag } from "lucide-react";


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
      name: "Home & Kitchen",
      slug: "home-kitchen",
      image: "/placeholder.svg?height=200&width=400",
    },
    {
      id: 5,
      name: "Home & Kitchen",
      slug: "home-kitchen",
      image: "/placeholder.svg?height=200&width=400",
    },
    {
      id: 6,
      name: "Home & Kitchen",
      slug: "home-kitchen",
      image: "/placeholder.svg?height=200&width=400",
    },
  ];

  const products = [
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
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8 w-[100vw] px-3 lg:px-15">
            {(categories.slice(0,6)).map((category) => ( // to limit to 6
              <Link key={category.id} href={`/products?category=${category.slug}`}>
                <Card className="overflow-hidden transition-all hover:shadow-lg pt-0">
                  <div className="relative h-[200px] w-full">
                      <Image
                        src={category.image || "/placeholder.svg"}
                        alt={category.name}
                        fill
                        className="object-cover"
                      />
                  </div>
                  <CardContent className="px-4">
                    <h3 className="text-xl font-semibold">{category.name}</h3>
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
            {(products.slice(0,15)).map((product) => (
              <Link key={product.id} href={`/products/${product.id}`}>
                <Card className="overflow-hidden transition-all hover:shadow-lg pt-0">
                  <div className="relative h-[250px] w-full">
                    <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
                  </div>
                  <CardContent className="flex flex-col px-4">
                    <h3 className="font-semibold h-12 overflow-hidden text-ellipsis">{product.name}</h3>
                    <div className="flex flex-col 2xl:flex-row items-center justify-between mt-2 xl:mt-0">
                      <span className="font-bold">${product.price.toFixed(2)}</span>
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

          <div className="flex justify-center mb-24 mt-6">
            <Link href="/products">
              <Button size={'xl'} className="mx-auto bg-slate-600 hover:bg-slate-800">
                View All Products
              </Button>
            </Link>
          </div>
    </div>
  );
}
