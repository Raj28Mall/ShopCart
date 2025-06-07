import React from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Package, Settings, Heart, CreditCard, LogOut } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

export default function AccountSidebar() {
    const router = useRouter();
    const handleLogOut=()=>{
        useAuthStore.getState().logout();
        router.push('/');
    }

    return(
        <Card className="pb-3">
        <CardHeader>
        <CardTitle className='text-xl'>Account</CardTitle>
        <CardDescription className="text-gray-400">Manage your account settings and preferences</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
        <nav className="flex flex-col">
            <Button variant={'ghost'} onClick={() => router.push('/account')} className="justify-start flex gap-2 mx-2 text-sm bg-muted font-medium">
            <User className="h-4 w-4" />
            Account Overview
            </Button>
            <Button variant={'ghost'} onClick={() => router.push('/account/orders')} className="flex justify-start gap-2 mx-2 text-sm hover:bg-muted/50 transition-colors">
            <Package className="h-4 w-4" />
            Orders
            </Button>
            <Button variant={'ghost'} onClick={() => router.push('/account/settings')} className="flex justify-start gap-2 mx-2 text-sm hover:bg-muted/50 transition-colors">
            <Settings className="h-4 w-4" />
            Settings
            </Button>
            <Button variant={'ghost'} onClick={() => router.push('/comingSoon')} className="flex justify-start gap-2 mx-2 text-sm hover:bg-muted/50 transition-colors">
            <Heart className="h-4 w-4" />
            Wishlist
            </Button>
            <Button variant={'ghost'} onClick={() => router.push('/comingSoon')} className="flex justify-start gap-2 mx-2 text-sm hover:bg-muted/50 transition-colors">
            <CreditCard className="h-4 w-4" />
            Payment Methods
            </Button>
            <Button variant={'ghost'} onClick={() => handleLogOut()} className="flex justify-start gap-2 mx-2 text-red-500 hover:text-red-600 transition-colors">
                <LogOut className="h-4 w-4" />
                Sign Out
            </Button>
        </nav>
        </CardContent>
    </Card>
    );
}
