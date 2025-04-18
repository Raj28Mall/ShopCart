import { z } from "zod";

export const orderSchema = z.object({
    userId: z.number({ message: "Invalid user ID" }),
    totalQuantity: z.number().min(1, {message:"Atleast one product required"}),
    totalPrice: z.number().min(0.01, { message: "Total price must be greater than zero" }),
    orderStatus: z.enum(["Delivered", "Processing", "Cancelled"], {
        errorMap: () => ({ message: "Invalid order status" }),
    }),
})

export type OrderSchema = z.infer<typeof orderSchema>;