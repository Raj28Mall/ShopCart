import express, {Request, Response} from 'express';
import db from '../db'; 
const router = express.Router(); 

//route for getting all current products
router.get('/products', async(req: Request, res: Response)=>{
    const QUERY="SELECT * FROM products";
    try{
        const [results] = await db.execute(QUERY);
        res.status(200).send(results);
    } catch(err){
        console.error("Error while fetching all products: ", err);
        res.status(500).send("Database error while fetching all products");
    }
})

router.post('/products', async (req: Request, res: Response) => {
    const pricePattern = /^\d+(\.\d{1,2})?$/;
    const ratingPattern = /^\d(\.\d{1})?$/;

    const products = req.body;

    if (!Array.isArray(products) || products.length === 0) {
        return res.status(400).send("Request body must be a non-empty array of products");
    }

    for (const product of products) {
        const { name, category, price, image, rating, quantity, shortDescription, longDescription } = product;

        if (
            !name || !category || !image || !shortDescription || !longDescription ||
            price === undefined || rating === undefined || quantity === undefined
        ) {
            return res.status(400).send("Incomplete field data in one of the products");
        }

        // Check price format
        if (!pricePattern.test(price.toString())) {
            return res.status(400).send("Price must be a valid decimal with up to two decimal places");
        }

        // Check quantity is an integer ≥ 0
        if (!Number.isInteger(quantity) || quantity < 0) {
            return res.status(400).send("Quantity must be a non-negative integer");
        }

        // Check rating format
        if (!ratingPattern.test(rating.toString()) || rating < 0 || rating > 5) {
            return res.status(400).send("Rating must be a decimal between 0 and 5, with one decimal place");
        }
    }

    const QUERY = `
        INSERT INTO products 
        (name, category, price, image, rating, quantity, shortDescription, longDescription) 
        VALUES ?
    `;

    const values = products.map(product => [
        product.name,
        product.category,
        parseFloat(product.price),
        product.image,
        parseFloat(product.rating),
        parseInt(product.quantity),
        product.shortDescription,
        product.longDescription
    ]);

    try {
        const [results]: any = await db.query(QUERY, [values]);
        return res.status(201).send(`${results.affectedRows} products successfully added`);
    } catch (err) {
        console.error(err);
        return res.status(500).send("Error while sending data to database");
    }
});


export default router;
