import express, {Request, Response} from 'express';
import db from '../db'; 
const router = express.Router(); 

// route for adding a single product
router.post('/products/', async (req: Request, res: Response) => {
    const pricePattern = /^\d+(\.\d{1,2})?$/;
    const ratingPattern = /^\d(\.\d{1})?$/;
    
    const { name, category, price, image, rating, stock, shortDescription, longDescription, status } = req.body;
    
    if (!name || !category || !image || !shortDescription || !longDescription || price === undefined || rating === undefined || stock === undefined || status === undefined) {   
        res.status(400).send("Incomplete field data for the product");
    }
    if (!pricePattern.test(price.toString())) {
        res.status(400).send("Price must be a valid decimal with up to two decimal places");
    }
    if (!Number.isInteger(stock) || stock < 0) {
        res.status(400).send("Stock must be a non-negative integer");
    }
    if (!ratingPattern.test(rating.toString()) || rating < 0 || rating > 5) {
        res.status(400).send("Rating must be a decimal between 0 and 5, with one decimal place");
    }
    
    const QUERY = `INSERT INTO products (name, category, price, image, rating, stock, shortDescription, longDescription, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const values = [
        name,
        category,
        Number(parseFloat(price).toFixed(2)),
        image,
        Number(parseFloat(rating).toFixed(1)),
        parseInt(stock),
        shortDescription,
        longDescription,
        status,
    ];
    
    try {
        const [results]: any = await db.query(QUERY, values);
        res.status(201).send("Product successfully added");
    } catch (err) {
        console.error("Error while adding product: ", err);
        res.status(500).send("Error while sending data to database");
    }
});

// route for adding products in bulk
router.post('/products/bulk', async (req: Request, res: Response) => {
    const products = req.body.products;
    if (!Array.isArray(products) || products.length === 0) {
        res.status(400).send("No products provided");
    }

    const values = products.map((product: any) => {
        const {
            name,
            category,
            price,
            image,
            rating,
            stock,
            shortDescription,
            longDescription,
            status
        } = product;
        [
            name,
            category,
            Number(parseFloat(price).toFixed(2)),
            image,
            Number(parseFloat(rating).toFixed(1)),
            parseInt(stock),
            shortDescription,
            longDescription,
            status,
        ];
    });

    const QUERY = `INSERT INTO products (name, category, price, image, rating, stock, shortDescription, longDescription, status) VALUES ?`;

    try {
        await db.query(QUERY, [values]);
        res.status(201).send("Products added successfully");
    } catch (err) {
        console.error("Error while adding products: ", err);
        res.status(500).send("Database error while adding products");
    }
});


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

router.delete('/products/:id', async (req: Request, res: Response) => {
    const productId = req.params["id"];
    const QUERY = `DELETE FROM products WHERE id = ?`;
    try {
        const [results]: any = await db.query(QUERY, [productId]);
        if (results.affectedRows === 0) {
            res.status(404).send("Product not found");
        }
        res.status(200).send("Product deleted successfully");
    } catch (err) {
        console.error("Error while deleting product: ", err);
        res.status(500).send("Database error while deleting product");
    }
});


export default router;
