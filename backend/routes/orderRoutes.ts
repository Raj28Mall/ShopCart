import express, {Request, Response} from 'express';
import db from '../db'; 
const router = express.Router(); 

//productId, productName, productImage, productPrice, orderNo, quantity  --> one product
// one order can have multiple products and a status code

// route for creating adding order to order history
router.post('api/orders', async(req: Request, res: Response)=>{
    const {userId, totalPrice, totalQuantity, orderStatus} = req.body;
    const QUERY="INSERT INTO orders (userId, totalPrice, totalQuantity, orderStatus) VALUES (?, ?, ?, ?)";
    try{
        const [results] = await db.execute(QUERY, [userId, totalPrice, totalQuantity, orderStatus]);
        res.status(200).send(results);
    } catch(err){
        console.error("Error while adding order to order history: ", err);
        res.status(500).send("Database error while adding order to order history");
    }
});

//route for getting order history
router.get('api/orders', async(req: Request, res: Response)=>{
    const QUERY="SELECT * FROM orders";
    try{
        const [results] = await db.execute(QUERY);
        res.status(200).send(results);
    } catch(err){
        console.error("Error while fetching order history: ", err);
        res.status(500).send("Database error while fetching order history");
    }
});

//route for adding products of a particular order
router.post('api/order_products', async(req: Request, res: Response)=>{
    const {orderId, productId, productName, productImage, productPrice, productQuantity} = req.body;
    const QUERY="INSERT INTO orderProducts (orderId, productId, productName, productImage, productPrice,  productQuantity) VALUES (?, ?, ?, ?, ?)";
    try{
        const [results] = await db.execute(QUERY, [orderId, productId, productName, productImage, productPrice, productQuantity]);
        res.status(200).send(results);
    } catch(err){
        console.error("Error while adding order to order history: ", err);
        res.status(500).send("Database error while adding order to order history");
    }
});

//route for getting products of a particular order
router.get('api/order_products', async(req: Request, res: Response)=>{
    const orderId = req.query["orderId"];
    const QUERY=`SELECT * FROM orderProducts WHERE orderId = ${orderId}`;
    try{
        const [results] = await db.execute(QUERY);
        res.status(200).send(results);
    } catch(err){
        console.error("Error while fetching order history: ", err);
        res.status(500).send("Database error while fetching order history");
    }
});

export default router;
