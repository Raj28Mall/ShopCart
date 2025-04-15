import express, {Request, Response} from 'express';
import db from '../db'; 
const router = express.Router(); 

// route for creating adding order to order history
router.post('api/orders', async(req: Request, res: Response)=>{
    const {userId, productId, orderNo, quantity} = req.body;
    const QUERY="INSERT INTO orders (user_id, product_id, quantity) VALUES (?, ?, ?, ?)";
    try{
        const [results] = await db.execute(QUERY, [userId, productId, orderNo, quantity]);
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

export default router;
