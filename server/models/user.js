const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let validRoles = {
    values:['ADMIN_ROLE','USER_ROLE'],
    message:'{VALUE} isnt a valid role'
}

let Schema = mongoose.Schema;

let userSchema = new Schema({
    name:{
        type:String,
        require: true
    },
    email:{
        type:String,
        require:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    img:{
        type:String,
        required:false
    },
    role:{
        default:"USER_ROLE",
        type:String,
        enum: validRoles
    },
    status:{
        type:Boolean,
        default:true
    },
    google:{
        type:Boolean,
        default:false
    }
});

userSchema.methods.toJSON = function(){
    let user = this;
    let userObjet = user.toObject();
    delete userObjet.password;
    return userObjet;
}
userSchema.plugin(uniqueValidator,{message:'{PATH} must be unique'});

module.exports = mongoose.model('User', userSchema);