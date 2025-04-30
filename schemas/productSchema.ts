import { z } from "zod";

export const productSchema = z.object({
    name: z.string().min(1, { message: "Product name is required" }),
    category: z.string().min(1, { message: "Category is required" }),
    image: z.string().min(1, { message: "Image is required" }),
    price: z.number().min(0.01, { message: "Product price must be greater than zero" }),
    shortDescription: z.string().min(1, { message: "Short description is required" }),
    longDescription: z.string().min(1, { message: "Long description is required" }),
    status: z.enum(["active", "draft", "archive"], { message: "Invalid status" }),
})

export type ProductSchema = z.infer<typeof productSchema>;