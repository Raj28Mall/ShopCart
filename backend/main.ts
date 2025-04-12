import express from 'express';
import bodyParser from 'body-parser';
import productRoutes from './routes/productRoutes'; 

const app = express();
const PORT = 5000;

app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true })); 

// Using productRoutes for any routes under "/api"
app.use('/api', productRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
