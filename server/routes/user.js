const express = require('express');


const bcrypt = require('bcrypt');
const _ = require('underscore');

const User = require('../models/user');
const {verificationToken,verificationAdminRole} = require('../middlewares/authentication')

const app = express();

app.get('/user',verificationToken,function (req, res) {
    let from = req.query.from || 0;
    from = Number(from);

    let limit = req.query.limit || 5;
    limit = Number(from);

    User.find({status:true})
        .skip(from)
        .limit(limit)
        .exec((err,users)=>{
            if (err) {
                return res.status(400).json({
                    ok:false,
                    err
                });
            }
            User.count({status:true},(err,count)=>{
                res.json({
                    ok:true,
                    total:count,
                    users
                    
                })
            });
            
        });
});

app.post('/user',[verificationToken,verificationAdminRole],function (req, res) {

    let body = req.body;

    let user = new User({
        name: body.name,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });
    user.save((err, userDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            user: userDB
        })
    });

});


app.put('/user/:id', [verificationToken,verificationAdminRole],function (req, res) {
    let id = req.params.id;
    let body = _.pick(req.body, ['name', 'email', 'img', 'role', 'status']);

    User.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, userDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            user: userDB
        });
    });


})
app.delete('/user/:id',[verificationToken,verificationAdminRole],function (req, res) {
    let id = req.params.id;
    let changeStatus = {
        status:false
    }
    User.findByIdAndUpdate(id, changeStatus, { new: true}, (err, deletedUser) => {
        if (err) {
            return res.status(400).json({
                ok:false,
                err
            });
        }
        if (!deletedUser) {
            return res.status(400).json({
                ok:false,
                err:{
                    message: 'User not found'
                }
            });
        }
        res.json({
            ok:true,
            user:deletedUser
        });
    });
});

module.exports = app;