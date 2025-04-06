'use client';
import * as React from 'react';
import { useState, useEffect, use } from 'react';
import { useProductStore } from '@/store/productStore';
import { Navbar } from '@/components/navbar';

export default function ProductPage({ params }: { params: Promise<{ id: number }> }) {
    const [loading, setLoading] = useState<boolean>(false);
    const {id} = use(params);
    const product= useProductStore((state) => state.products.find((product) => product.id === id));

    return(
        <div className='overflow-x-hidden min-h-screen'>
            <Navbar/>
        </div>
    );
}