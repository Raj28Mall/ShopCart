// src/app/admin/products/new/page.tsx (or your edit page)
"use client";
import type React from "react";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react"; 
import { Button } from "@/components/ui/button";
import { AdminSidebar } from "@/components/adminSidebar";
import { editProduct, getProduct } from "@/lib/api"; 
import { toast } from "react-hot-toast";
import { ProductForm } from "@/components/productForm"; 
import { set } from "zod";

interface Product{
    name: string;
    category: string;
    price: string;
    image: File | string;
    rating?: string;
    stock: string;
    shortDescription: string;
    longDescription: string;
    status: string;
};

export default function EditProductPage() { 
  const params= useParams();
  const productId= (params.id) as string;
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string; role: string } | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageUpdate, setImageUpdate] = useState(false);
  
  const [formData, setFormData] = useState<Product>({
    name: "", 
    category: "",
    price: "",
    image: "",
    rating: "",
    stock: "",
    shortDescription: "",
    longDescription: "",
    status: "",
  });
  useEffect(() => {
    const fetchProductData = async (productId: string) => {
      const productData = await getProduct(productId); 
      setFormData(productData);
      if (typeof productData.image === 'string') { 
        setImagePreview(productData.image);
      }
    };
    if (productId) fetchProductData(productId);
  }, [productId]); 

  useEffect(() => {
    setUser({
      name: "Test Admin",
      email: "admin@example.com",
      role: "admin",
    })
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData({ ...formData, image: file });
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      }
      reader.readAsDataURL(file)
    }
  }
  
  const removeImage = () => {
    setImageUpdate(true);
    setFormData({ ...formData, image: "" });
    setImagePreview(null);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await editProduct(productId, formData);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Product updated successfully");
      router.push("/admin/dashboard");
    } catch (error) {
      console.error("Failed to update product:", error);
      toast.error("Failed to update product");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-muted/30">
      <AdminSidebar />

      <div className="flex-1">
        <header className="bg-card bg-white border-b sticky top-0 z-10">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-2">
               <Link href="/admin/dashboard" className="flex items-center text-sm hover:text-primary">
                 <ArrowLeft className="h-4 w-4 mr-1" />
                 Back to Dashboard
               </Link>
            </div>
            <h1 className="text-xl font-semibold">Edit Product</h1>
            <div className="w-20"></div>
          </div>
        </header>

        <main className="p-4 md:p-6">
          <form onSubmit={handleSubmit}>
            <ProductForm
              formData={formData}
              imagePreview={imagePreview}
              handleInputChange={handleInputChange}
              handleSelectChange={handleSelectChange}
              handleImageChange={handleImageChange}
              removeImage={removeImage}
            />

            <div className="flex items-center justify-end gap-4">
              <Button type="button" variant="outline" onClick={() => router.push("/admin/dashboard")}>
                Cancel
              </Button>
              <Button className="bg-green-500 text-white" type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Edit Product"}
              </Button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}