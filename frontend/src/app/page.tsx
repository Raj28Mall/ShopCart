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
      name: "Slim Fit Jeans",
      price: 59.99,
      image: "/placeholder.svg?height=250&width=250",
    },
    {
      id: 5,
      name: "Slim Fit Jeans",
      price: 59.99,
      image: "/placeholder.svg?height=250&width=250",
    },
    {
      id: 6,
      name: "Slim Fit Jeans",
      price: 59.99,
      image: "/placeholder.svg?height=250&width=250",
    },
    {
      id: 7,
      name: "Slim Fit Jeans",
      price: 59.99,
      image: "/placeholder.svg?height=250&width=250",
    },
    {
      id: 8,
      name: "Slim Fit Jeans",
      price: 59.99,
      image: "/placeholder.svg?height=250&width=250",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen max-w-screen bg-slate-100 overflow-x-hidden">
      <Navbar />
      <AspectRatio ratio={1920/650}>
        <Image src="/hero.png" alt="Hero Image" fill/>
      </AspectRatio>
      <div className="category-shopping w-[100vw] flex flex-col justify-center items-center py-10">
        <div className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl pb-3">Shop by Category</div>
          <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">Check out our most popular items handpicked for you</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8 w-[100vw] px-15">
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 my-8 px-12">
            {(products.slice(0,8)).map((product) => (
              <Link key={product.id} href={`/products/${product.id}`}>
                <Card className="overflow-hidden transition-all hover:shadow-lg pt-0">
                  <div className="relative h-[250px] w-full">
                    <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
                  </div>
                  <CardContent className="px-4">
                    <h3 className="font-semibold">{product.name}</h3>
                    <div className="flex items-center justify-between mt-2">
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
