const {Schema, model} = require('mongoose')

const ErrorLogModel = new Schema({
    data:{type:Date},
    text:{type:String},
    service:{type:String}
})
module.exports = model('ErrorLog', ErrorLogModel)