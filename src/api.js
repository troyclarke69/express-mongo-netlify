// import productRoute from '../routes/productRoute';
const express = require("express");
const serverless = require("serverless-http");
const mongoose = require('mongoose');

const prodctSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
  brand: { type: String, required: true },
  price: { type: Number, default: 0, required: true },
  category: { type: String, required: true },
  countInStock: { type: Number, default: 0, required: true },
  description: { type: String, required: true },
  rating: { type: Number, default: 0, required: true },
  numReviews: { type: Number, default: 0, required: true },
});
const Product = mongoose.model("Product", prodctSchema);

// const mongodbUrl = config.MONGODB_URL;
const mongodbUrl = 'mongodb+srv://troy:Gruj3267@cluster0-orxh2.gcp.mongodb.net/goshop';

mongoose.connect(mongodbUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
}).catch((error) => 
  console.log(error.reason));

const app = express();
app.use(express.json());
app.use(express.urlencoded( {extended: true} ));

const router = express.Router();
// router.get("/", (req, res) => {
//   res.json({
//     hello: "hi!"
//   });
// });

router.get("/", async (req, res) => {
  const category = req.query.category ? { category: req.query.category } : {};
  const searchKeyword = req.query.searchKeyword ? {
    name: {
      $regex: req.query.searchKeyword,
      $options: 'i'
    }
  } : {};
  const sortOrder = req.query.sortOrder ?
    (req.query.sortOrder === 'lowest' ? { price: 1 } : { price: -1 })
    :
    { _id: -1 };
  const products = await Product.find({ ...category, ...searchKeyword }).sort(sortOrder);
  res.send(products);
});

app.use(`/.netlify/functions/api/products`, router);

// app.use('/api/users', userRoute);
// app.use('/api/products', productRoute);
// app.use('/api/orders', orderRoute);
// app.get('/api/config/paypal', (req, res) => {
//   res.send(config.PAYPAL_CLIENT_ID);
// });

module.exports = app;
module.exports.handler = serverless(app);

//npm install express netlify-lambda serverless-http
//npm run build
// http://localhost:9000/.netlify/functions/api