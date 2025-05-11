import express, {Request, Response} from 'express';
import { ResultSetHeader } from 'mysql2';
import { requireAuth } from "../middleware/requireAuth";
import db from '../db'; 
const router = express.Router(); 

// Helper function to convert Buffer to binary for MySQL
const handleUserId = (userId: any) => {
  
  if (!userId) {
    console.error('No userId provided');
    return null;
  }
  
  if (typeof userId === 'object' && userId.type === 'Buffer' && Array.isArray(userId.data)) {
    return Buffer.from(userId.data);
  }
  
  if (Buffer.isBuffer(userId)) {
    return userId;
  }
  
  if (typeof userId === 'string') {
    return userId;
  }
  
  console.error('Unsupported userId format');
  return null;
};

// route for creating adding order to order history
router.post('/orders', requireAuth, async(req: Request, res: Response)=>{
    const { totalPrice, totalQuantity, orderStatus} = req.body;
    const userId = req.user?.userId;
    
    if(!userId){
        return res.status(401).json({ message: "Unauthorized. No user ID found." });
    }
    
    // Get proper binary format for userId
    const userIdBuffer = handleUserId(userId);
    
    if (!userIdBuffer) {
        return res.status(400).json({ 
            message: "Invalid user ID format", 
            userId: userId 
        });
    }
    
    // Direct insertion of binary data - no UUID_TO_BIN needed
    const QUERY = "INSERT INTO orders (userId, totalPrice, totalQuantity, orderStatus) VALUES (?, ?, ?, ?)";
    
    try{
        const [results] = await db.execute(QUERY, [userIdBuffer, totalPrice, totalQuantity, orderStatus]);
        const orderId = (results as ResultSetHeader).insertId;
        return res.status(201).json({"success":true, "orderId": orderId});
    } catch(err){
        console.error("Error while adding order to order history: ", err);
        return res.status(500).json({ 
            message: "Database error while adding order to order history", 
            error: err,
            userId: userId,
            userIdType: typeof userId
        });
    }
});

//route for getting order history
router.get('/orders', requireAuth, async(req: Request, res: Response)=>{
    const userId = req.user?.userId;
    if(!userId){
        return res.status(401).json({ message: "Unauthorized. No user ID found." });
    }
    
    // Get proper binary format for userId
    const userIdBuffer = handleUserId(userId);
    
    if (!userIdBuffer) {
        return res.status(400).json({ 
            message: "Invalid user ID format", 
            userId: userId 
        });
    }
    
    // Direct comparison with binary data
    const QUERY = "SELECT * FROM orders WHERE userId = ?";
    
    try{
        const [results] = await db.execute(QUERY, [userIdBuffer]); 
        return res.status(200).json(results);
    } catch(err){
        console.error("Error while fetching order history: ", err);
        return res.status(500).json({ 
            message: "Database error while fetching order history", 
            error: err,
            userId: userId
        });
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
        return res.status(201).send({ message: "Products inserted successfully", results });
    } catch (err) {
        console.error("Error inserting products: ", JSON.stringify(err, null, 2));
        return res.status(500).send("Database error while inserting products");
    }
});

//route for getting products of a particular order
router.get('/order_products', async(req: Request, res: Response)=>{
    const orderId = req.query["orderId"];
    const QUERY=`SELECT * FROM orderProducts WHERE orderId = ${orderId}`;
    try{
        const [results] = await db.execute(QUERY);
        return res.status(200).send(results);
    } catch(err){
        console.error("Error while fetching order products: ", err);
        return res.status(500).send("Database error while fetching order products");
    }
});

export default router;
