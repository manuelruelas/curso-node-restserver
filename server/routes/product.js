const express = require('express');
const { verificationToken } = require('../middlewares/authentication');
const _ = require('underscore');
let app = express();
let Product = require('../models/product');

app.get('/product', (req, res) => {
    let limit = req.query.limit || 5;
    let skip = req.query.skip || 0;
    Product.find()
        .limit(limit)
        .skip(skip)
        .populate('user', 'name')
        .populate('category', 'description')
        .exec((err, productsDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }
            Product.count({}, (err, count) => {
                res.json({
                    ok: true,
                    results: productsDB,
                    count
                })
            })
        })
});


app.get('/product/:id', (req, res) => {
    let id = req.params.id;
    Product.findById(id)
        .populate('user', 'name')
        .populate('description')
        .exec((err, productDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }
            if (!productDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Product not found'
                    }
                })
            }

            res.json({
                ok: true,
                product: productsDB
            });
        });
});


app.post('/product', verificationToken, (req, res) => {
    let body = req.body;
    let product = new Product({
        name: body.name,
        unitPrice: body.unitPrice,
        description: body.description,
        category: body.category,
        user: req.user._id
    });

    product.save((err, productDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        return res.json({
            ok: true,
            product: productDB
        });
    })
});

app.put('/product/:id', (req, res) => {
    let id = req.params.id

    let body = _.pick(req.body, ['name', 'unitPrice', 'description', 'category']);
    Product.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, productDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            product: productDB,
            message: ''
        })
    });
});

app.delete('/product/:id', (req, res) => {
    let id = req.params.id;
    let changeStatus = {
        available: false
    }
    Product.findByIdAndUpdate(id, changeStatus, { new: true }, (err, productDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        if (!productDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Product not found'
                }
            });
        }
        res.json({
            ok: true,
            product: productDB
        });
    });
});
module.exports = app;