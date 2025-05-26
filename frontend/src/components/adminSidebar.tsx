"use client";
import { LayoutDashboard, ShoppingBag, Settings, LogOut } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/authStore";
import { useUserStore } from "@/store/userStore";
import { useRouter } from "next/navigation";
import Link from "next/link";

export const AdminSidebar = () => {
    const router = useRouter();
    const { logout } = useAuthStore();
    const user = useUserStore((state) => state.user);
    
    const handleLogout = () => {
        logout();
        router.push('/');
    };

    return(
        <aside className="hidden md:flex w-64 flex-col bg-card border-r">
        <div className="p-6">
        <Link href="/" className="flex flex-row justify-center items-center space-x-2 px-10 mr-5 transform transition-transform duration-150 ease-[cubic-bezier(0.4,0,0.2,1)] hover:scale-[1.03] hover:-translate-y-0.5">
            <div className="relative h-8 w-8 bottom-1">
                <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="40" height="40" viewBox="0 0 48 48">
                    <path fill="#1976D2" d="M37.216,11.78c-0.023-0.211-0.211-0.305-0.351-0.305s-3.21-0.234-3.21-0.234s-2.132-2.132-2.39-2.343   c-0.234-0.234-0.68-0.164-0.867-0.117c-0.023,0-0.469,0.141-1.195,0.375c-0.726-2.086-1.968-3.984-4.194-3.984h-0.211   C24.187,4.375,23.391,4,22.735,4c-5.155,0-7.639,6.444-8.412,9.725c-2.015,0.633-3.445,1.054-3.609,1.125   c-1.125,0.351-1.148,0.375-1.289,1.429c-0.117,0.797-3.046,23.456-3.046,23.456L29.179,44l12.373-2.671 C41.575,41.282,37.24,11.991,37.216,11.78z M27.937,9.483c-0.562,0.164-1.242,0.375-1.921,0.609V9.671  c0-1.265-0.164-2.296-0.469-3.117C26.718,6.695,27.445,7.984,27.937,9.483L27.937,9.483z M24.117,6.812 c0.305,0.797,0.516,1.922,0.516,3.468v0.234c-1.265,0.398-2.601,0.797-3.984,1.242C21.422,8.804,22.899,7.351,24.117,6.812  L24.117,6.812z M22.617,5.359c0.234,0,0.469,0.094,0.656,0.234c-1.664,0.773-3.421,2.718-4.148,6.655   c-1.101,0.351-2.156,0.656-3.163,0.984C16.806,10.233,18.915,5.359,22.617,5.359z"></path>
                    <path fill="#1976D2" d="M36.865,11.428c-0.141,0-3.21-0.234-3.21-0.234s-2.132-2.132-2.39-2.343    C31.17,8.757,31.053,8.71,30.96,8.71L29.249,44l12.373-2.671c0,0-4.335-29.338-4.359-29.549    C37.169,11.569,37.005,11.475,36.865,11.428z"></path>
                    <path fill="#fff" d="M24.792,18.593l-1.475,4.449c0,0-1.337-0.715-2.927-0.715c-2.374,0-2.489,1.498-2.489,1.867   c0,2.028,5.301,2.812,5.301,7.583c0,3.757-2.374,6.177-5.578,6.177c-3.872,0-5.808-2.397-5.808-2.397l1.037-3.411   c0,0,2.028,1.752,3.734,1.752c1.129,0,1.59-0.876,1.59-1.521c0-2.651-4.333-2.766-4.333-7.145c0-3.665,2.628-7.214,7.952-7.214  C23.777,17.994,24.792,18.593,24.792,18.593z"></path>
                </svg>
            </div>
            <span className="text-xl font-bold text-black">Shopcart</span>
        </Link>
        </div>
        <nav className="flex-1 px-4 py-2 space-y-1">
          <Button variant="ghost" onClick={() => router.push('/admin/dashboard')} className="w-full flex items-center justify-start gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-muted">
            <LayoutDashboard className="h-5 w-5" />
            Dashboard
          </Button>
          <Button variant="ghost" onClick={() => router.push('/admin/dashboard/settings')} className="w-full flex items-center justify-start gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-muted">
            <Settings className="h-5 w-5" />
            Settings
          </Button>
        </nav>
        <div className="p-4 border-t">
          <div className="flex items-center gap-3 mb-4">
            <Avatar>
              <AvatarImage src={user.picture} />
              <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{user?.name || "User"}</p>
              <p className="text-xs text-muted-foreground">{user?.email || "user@example.com"}</p>
            </div>
          </div>
          <Button variant="outline" className="w-full justify-start " onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Log out
          </Button>
        </div>
      </aside>
    );
}