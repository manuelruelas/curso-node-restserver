const express = require('express');
let { verificationToken, verificationAdminRole } = require('../middlewares/authentication');
const _ = require('underscore');
const app = express();

const Category = require('../models/category');

app.get('/category', verificationToken, (req, res) => {
    Category.find()
    .populate('user', 'name')
    .exec((err, categories) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        Category.count((err, count) => {
            return res.json({
                ok: true,
                categories,
                count
            });
        });
    });
});

app.get('/category/:id', verificationToken, (req, res) => {
    let id = req.params.id;
    Category.findById(id, (err, categoryDB) => {
        if (err) {
            return res.status(404).json({
                ok: false,
                err
            });
        }
        return res.json({
            ok: true,
            categoryDB
        })

    });
});

app.post('/category', [verificationToken, verificationAdminRole], (req, res) => {
    let body = req.body;

    let category = new Category({
        description: body.description,
        user: req.user._id
    });

    category.save((err, categoryDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        return res.json({
            ok: true,
            category: categoryDB
        });
    })
});

app.put('/category/:id',[verificationToken, verificationAdminRole], (req, res) => {
    let id = req.params.id
    let body = _.pick(req.body, ['description']);
    Category.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, categoryDB) => {
        if(err){
            return res.status(400).json({
                ok:false,
                err
            });
        }
        return res.json({
            ok:true,
            category:categoryDB
        })
    });

});

app.delete('/category/:id',[verificationToken, verificationAdminRole],(req,res)=>{
    let id = req.params.id;
    Category.findByIdAndRemove(id,(err,categoryDB)=>{
        if(err){
            return res.status(500).json({
                ok:false,
                err
            });
        }
        if(!categoryDB){
            return res.status(400).json({
                ok:false,
                err:{
                    message:'Category not found'
                }
            });
        }
        res.json({
            ok:true,
            category:categoryDB,
            message:'Category deleted'
        })
    });
});

module.exports = app;