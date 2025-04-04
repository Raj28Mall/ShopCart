'use client';
import * as React from 'react';
import { useState, useEffect, use } from 'react';
import { useProductStore } from '@/store/productStore';

export default function ProductPage({ params }: { params: Promise<{ id: number }> }) {
    const [loading, setLoading] = useState<boolean>(false);
    const {id} = use(params);
    const product= useProductStore((state) => state.products.find((product) => product.id === id));

    return(
        <div>Hello you are on product ID page</div>
    );
}