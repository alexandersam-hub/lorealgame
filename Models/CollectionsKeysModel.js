const {Schema, model} = require('mongoose')

const CollectionKeys = new Schema({
    game:{type:String, required:true},
    correctKey:{type:[Object]},
    incorrectKey:{type:[Object]},
    drawKey:{type:[Object]},
    price:{type:Number},
    mark:{type:String},
    isActive:{type:Boolean, required:true, default:true}
})

module.exports = model('Keys', CollectionKeys)