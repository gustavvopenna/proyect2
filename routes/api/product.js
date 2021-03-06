const express = require('express');
const multer = require('multer');

const { hasRole } = require('../../handlers/middlewares');
const Product = require('../../models/Product');

const upload = multer({ dest: './public/images/products' });
const router = express.Router();

// Create
router.post('/', hasRole('admin'), upload.single('image'), (req, res, next) => {
  const { place, name, description, price } = req.body;

  Product.create({
    owner: place,
    name,
    description,
    photoURL: `/images/products/${req.file.filename}`,
    price
  })
    .then(product => res.send(product))
    .catch(err => console.log(err));
});

// Read
router.get('/', (req, res, next) => {
  const { place } = req.user;

  Product.find({ owner: place })
    .then(products => res.send(products))
    .catch(err => console.log(err));
});
router.get('/all/:id', (req, res, next) => {
  const { id } = req.params;

  Product.find({ owner: id })
    .then(products => res.send(products))
    .catch(err => console.log(err));
});
router.get('/:id', (req, res, next) => {
  const { id } = req.params;

  Product.findById(id)
    .then(product => res.send(product))
    .catch(err => console.log(err));
});

// Update
router.patch('/:id', hasRole('admin'), upload.single('image'), (req, res, next) => {
  const { id } = req.params;
  const { name, description, price, photoURL } = req.body;

  Product.findByIdAndUpdate(
    id,
    {
      name,
      description,
      photoURL: req.file ? `/images/products/${req.file.filename}` : photoURL,
      price
    },
    { new: true }
  )
    .then(product => res.send(product))
    .catch(err => console.log(err));
});

// Delete
router.delete('/:id', hasRole('admin'), (req, res, next) => {
  const { id } = req.params;

  Product.findByIdAndDelete(id)
    .then(product => res.send(product))
    .catch(err => console.log(err));
});

module.exports = router;
