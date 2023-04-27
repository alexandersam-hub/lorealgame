const {Schema, model} = require('mongoose')

const UserModel = new Schema({
    username:{type:String, unique:true, required:true},
    password:{type:String, required: true},
    stringName:{type:String},
    role:{type:String},
    game:{type:String},
    type:{type:String},
    isActive:{type:Boolean, required: true, default:true},
    description:{type:String},
})

module.exports = model('User',UserModel)