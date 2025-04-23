import express, {Request, Response} from 'express';
import { ResultSetHeader } from 'mysql2';
import { requireAuth } from "../middleware/requireAuth";
import db from '../db'; 
const router = express.Router(); 

// route for creating adding order to order history
router.post('/orders', requireAuth, async(req: Request, res: Response)=>{
    const { totalPrice, totalQuantity, orderStatus} = req.body;
    const userId= req.user?.userId;
    if(!userId){
        return res.status(401).json({ message: "Unauthorized. No user ID found." });
    }
    const QUERY="INSERT INTO orders (userId, totalPrice, totalQuantity, orderStatus) VALUES (?, ?, ?, ?)";
    try{
        const [results] = await db.execute(QUERY, [userId, totalPrice, totalQuantity, orderStatus]);
        const orderId = (results as ResultSetHeader).insertId;
        res.status(201).send({"success":"true", "orderId": orderId});
    } catch(err){
        console.error("Error while adding order to order history: ", err);
        res.status(500).send("Database error while adding order to order history"+ err);
    }
});

//route for getting order history
router.get('/orders', requireAuth, async(req: Request, res: Response)=>{
    const userId = req.user?.userId;
    if(!userId){
        return res.status(401).json({ message: "Unauthorized. No user ID found." });
    }

    const QUERY="SELECT * FROM orders WHERE userId = ?";
    try{
        const [results] = await db.execute(QUERY, [userId]); //ADD USER ID HERE
        res.status(200).send(results);
    } catch(err){
        console.error("Error while fetching order history: ", err);
        res.status(500).send("Database error while fetching order history");
    }
});

//route for adding products of a particular order
router.post('/order_products', async (req: Request, res: Response) => {
    const { orderId, products } = req.body;

    if (!Array.isArray(products) || products.length === 0) {
        return res.status(400).send("Products must be a non-empty array.");
    }

    for (const product of products) {
        const { productId, productName, productPrice, productQuantity } = product;
        if (!productId || !productName || !productPrice || !productQuantity) {
            return res.status(400).send("Each product must have productId, productName, productPrice, and productQuantity.");
        }
    }

    const QUERY = `INSERT INTO orderProducts 
        (orderID, productID, productName, productImage, productPrice, productQuantity) 
        VALUES ${products.map(() => "(?, ?, ?, ?, ?, ?)").join(", ")}`;

    const values = products.flatMap(p => [
        orderId,
        p.productId,
        p.productName,
        p.productImage || null,
        p.productPrice,
        p.productQuantity
    ]);

    try {
        const [results] = await db.execute(QUERY, values);
        res.status(201).send({ message: "Products inserted successfully", results });
    } catch (err) {
        console.error("Error inserting products: ", JSON.stringify(err, null, 2));
        res.status(500).send("Database error while inserting products");
    }
});

//route for getting products of a particular order
router.get('/order_products', async(req: Request, res: Response)=>{
    const orderId = req.query["orderId"];
    const QUERY=`SELECT * FROM orderProducts WHERE orderId = ${orderId}`;
    try{
        const [results] = await db.execute(QUERY);
        res.status(200).send(results);
    } catch(err){
        console.error("Error while fetching order products: ", err);
        res.status(500).send("Database error while fetching order products");
    }
});

export default router;
