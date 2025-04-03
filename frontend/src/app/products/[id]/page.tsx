'use client';
import * as React from 'react';
import { useState, useEffect, use } from 'react';
import { useProductStore } from '@/store/productStore';

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
    const product= useProductStore((state) => state.products.find((product) => product.id === params.id));
    const [loading, setLoading] = useState<boolean>(false);
    const {id} = use(params);

    setTimeout(() => {
        setLoading(true);
        console.log("Product ID:", id);
        console.log("Product:", product);
        console.log("Loading:", loading);
    }
    , 2000);

    return(
        <div>Hello you are on product ID page</div>
    );
}