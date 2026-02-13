// Load environment variables
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());
// Database connection
async function dbConnection() {
  try {
    await mongoose.connect(
      process.env.DB_URL || "mongodb://127.0.0.1:27017/ProjectOne",
    );
    console.log("MongoDB connected successfully");
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }
}

dbConnection();
// call schema

const Product = require("./models/Product");


//post products
app.post("/api/product", async (req, res) => {
  try {
    const { name, category, price } = req.body;
    if (!name || !category || !price) {
      return res.status(400).json({
        success: false,
        msg: "name , category and price are required",
      });
    }
    const product = await Product.create({ name, category, price });
    res.json({
      success: true,
      msg: "Product created successfully",
      data: product,
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, msg: "Server error", error: err.message });
  }
});
// get products
app.get("/api/products", async (req, res) => {
  try {
    const { category } = req.query;

    let filter = {};
    if (category) {
      filter.category = category;
    }
    const products = await Product.find(filter);
    const count = await Product.countDocuments();
    res.json({
      success: true,
      msg: "Products fetched successfully",
      totalProducts: count,
      data: products,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      msg: "Server error",
      error: err.message,
    });
  }
});
//delete product
app.delete("/api/product/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Product.deleteMany({ author: id });
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return res.status(404).json({ success: false, msg: "Product not found" });
    }
    res.json({
      success: true,
      msg: "Product deleted successfully",
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, msg: "Server error", error: err.message });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
