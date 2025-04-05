import * as React from 'react';
import { useState, useEffect } from 'react';
import Image from "next/image";
import Link from 'next/link';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";


interface ProductCardProps {
    name: string;
    image: string;
    price: number;
}

export const ProductCard = ({ name, image, price }: ProductCardProps) => {
    return (
        <Card className="overflow-hidden transition-all hover:shadow-lg pt-0">
            <div className="relative h-[250px] w-full">
                <Image src={image || "/placeholder.svg"} alt={name} fill className="object-cover" />
            </div>
            <CardContent className="flex flex-col px-4">
                <h3 className="font-semibold h-12 overflow-hidden text-ellipsis">{name}</h3>
                <div className="flex flex-col 2xl:flex-row items-center justify-between mt-2 xl:mt-0">
                    <span className="font-bold">₹{price.toFixed(2)}</span>
                    <Button size="sm" variant={'outline'} className="">
                        <ShoppingBag className="h-4 w-4 mr-2" />
                        Add to Cart
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}