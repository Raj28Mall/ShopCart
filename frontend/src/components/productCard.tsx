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
import { useCartStore } from "@/store/cartStore";

interface ProductCardProps {
    id: number;
    name: string;
    image: string;
    price: number;
    stock:number;
}

export const ProductCard = ({ id, name, image, price, stock }: ProductCardProps) => {
    const setCartItems = useCartStore((state) => state.setCartItems);
    const cartItems = useCartStore((state) => state.cartItems);
    const [qty, setQty] = useState<number>((cartItems.find((item) => item.id === id)?.quantity || 0));
    const router=useRouter();
    const handleCardClick = () => {
        router.push(`/products/${id}`);
    };

    const handleAddToCart = () => {
        setQty(qty + 1);
        const existingItem = cartItems.find((item) => item.id === id);
        let newItems;
        if (existingItem) {
            newItems = cartItems.map(item =>
                item.id === id ? { ...item, quantity: item.quantity + 1 } : item
            );
        } else {
            newItems = [...cartItems, { id, quantity: 1 }];
        }
        setCartItems(newItems);
    };

    const handleRemoveFromCart = () => {
        const existingItem = cartItems.find((item) => item.id === id);
        if (!existingItem) return;
    
        const newItems = existingItem.quantity === 1
            ? cartItems.filter(item => item.id !== id)
            : cartItems.map(item =>
                item.id === id ? { ...item, quantity: item.quantity - 1 } : item
        );
    
        setCartItems(newItems);
        if (qty > 1) {
            setQty(qty - 1);
        } else {
            setQty(0); 
        }
    };
    

    return (
        <Card className="overflow-hidden transition-all hover:shadow-lg pt-0 cursor-pointer bg-white" onClick={handleCardClick}>
            <div className="relative h-[250px] w-full">
                <Image 
                    src={image || "/placeholder.svg"} 
                    alt={name} 
                    fill 
                    className="object-cover"
                    loading="lazy" 
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" 
                />
            </div>
            <CardContent className="flex flex-col px-4">
                <h3 className="font-semibold h-12 overflow-hidden text-ellipsis cursor-text" onClick={(e)=>e.stopPropagation()}>{name}</h3>
                <div className="flex flex-col 2xl:flex-row items-center justify-between mt-2 xl:mt-0">
                    <span className="font-bold cursor-text py-2" onClick={(e)=> e.stopPropagation()}>₹{price.toFixed(2)}</span>
                    {qty <= 0 ? (
                        <Button size="sm" variant="outline" onClick={(e : React.MouseEvent<HTMLButtonElement>) => {e.stopPropagation(); handleAddToCart();}}>
                            <ShoppingBag className="h-4 w-4 mr-2" />
                            Add to Cart
                        </Button>
                    ) : (
                    <div className="flex items-center" onClick={(e: React.MouseEvent<HTMLDivElement>)=> e.stopPropagation()}>
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 rounded-r-none"
                            onClick={() => handleRemoveFromCart()}
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
                            onClick={() => {if(qty==stock-1){toast(`Only ${stock} items in stock`);}handleAddToCart()}}
                            disabled={qty >= stock}>
                            <Plus className="h-3 w-3" />
                        </Button>
                    </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};