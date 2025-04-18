import { z } from "zod";

export const orderProductSchema = z.object({
    orderID: z.number({ message: "Invalid order ID" }),
    productId: z.number({ message: "Invalid product ID" }),
    productName: z.string().min(1, { message: "Product name is required" }),
    productImage: z.string().url({ message: "Invalid image URL" }),
    productPrice: z.number().min(0.01, { message: "Product price must be greater than zero" }),
    quantity: z.number().min(1, { message: "At least one product required" }),
})

export type OrderProductSchema = z.infer<typeof orderProductSchema>;