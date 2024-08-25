const express = require('express');
const router = express.Router();
const Product = require('../db/models/Products');
const { upload, handleFileUpload } = require('../middleware/upload');

// Route to get all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products' });
  }
});

// Route to get a single product by ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching product' });
  }
});

// Route to add a new product
router.post('/addProducts', async (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ message: 'Product name is required' });
  }
  try {
    const newProduct = new Product({ name });
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ message: 'Error adding product' });
  }
});

// Update Route 
router.put('/update/:id', async (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ message: 'Product name is required' });
  }
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { name },
      { new: true }
    );
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error updating product' });
  }
});

// Route to delete a product by ID
router.delete('/delete/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (product) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product' });
  }
});

// Route to handle file uploads
router.post('/upload', upload.single('file'), handleFileUpload);

// Route to get all files
router.get('/files', async (req, res) => {
  try {
    const gfs = getGfs();
    const files = await gfs.files.find().toArray();
    res.json(files);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching files' });
  }
});

// Route to serve a specific file by filename
router.get('/files/:filename', async (req, res) => {
  try {
    const gfs = getGfs();
    const file = await gfs.files.findOne({ filename: req.params.filename });
    if (!file || !file.filename) {
      return res.status(404).json({ error: 'File not found' });
    }
    const readstream = gfs.createReadStream({
      filename: file.filename,
    });
    readstream.pipe(res);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching file' });
  }
});

module.exports = router;
