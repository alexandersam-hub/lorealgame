const {Schema, model} = require('mongoose')

const AnswerModel = new Schema({
    task:{type:String, required:true},
    user:{type:String},
    answer:{type:String},
    isModeration:{type:Boolean,required:true, default:false}
})

module.exports = model('answers', AnswerModel)