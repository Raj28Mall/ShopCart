'use client';
import * as React from 'react';
import { useState, useEffect } from 'react';
import Image from "next/image";
import Link from 'next/link';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Plus, Minus } from "lucide-react";
import { toast } from 'react-hot-toast';
import { useRouter } from "next/navigation"

interface ProductCardProps {
    id: number;
    name: string;
    image: string;
    price: number;
    quantity: number;
}

export const ProductCard = ({ id,  name, image, price, quantity }: ProductCardProps) => {
    const [qty, setQty]= useState<number>(quantity);
    const router=useRouter();

    const handleCardClick = () => {
        router.push(`/products/${id}`);
    };

    return (
        <Card className="overflow-hidden transition-all hover:shadow-lg pt-0 cursor-pointer" onClick={handleCardClick}>
            <div className="relative h-[250px] w-full">
                <Image src={image || "/placeholder.svg"} alt={name} fill className="object-cover" />
            </div>
            <CardContent className="flex flex-col px-4">
                <h3 className="font-semibold h-12 overflow-hidden text-ellipsis cursor-text" onClick={(e)=>e.stopPropagation()}>{name}</h3>
                <div className="flex flex-col 2xl:flex-row items-center justify-between mt-2 xl:mt-0">
                    <span className="font-bold cursor-text" onClick={(e)=> e.stopPropagation()}>₹{price.toFixed(2)}</span>
                    {qty <= 0 ? (
                        <Button size="sm" variant="outline" onClick={(e : React.MouseEvent<HTMLButtonElement>) => {e.stopPropagation(); setQty(1);}}>
                            <ShoppingBag className="h-4 w-4 mr-2" />
                            Add to Cart
                        </Button>
                    ) : (
                    <div className="flex items-center" onClick={(e: React.MouseEvent<HTMLDivElement>)=> e.stopPropagation()}>
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 rounded-r-none"
                            onClick={() => setQty(qty - 1)}
                            disabled={qty <= 0}>
                            <Minus className="h-3 w-3" />
                        </Button>
                        <div className="h-8 w-10 flex items-center justify-center border-y text-sm">
                            {qty}
                        </div>
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 rounded-l-none"
                            onClick={() => {if(qty>=10){toast.error("Max 10 elements per customer")}else{setQty(qty + 1);}}}
                            disabled={qty >= 10}>
                            <Plus className="h-3 w-3" />
                        </Button>
                    </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}