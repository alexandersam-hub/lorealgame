const {Schema, model} = require('mongoose')

const QuestionModel = new Schema({
    task:{type:String, required:true},
    questions:{type:[Object], required:true, default:true}
})

module.exports = model('questions', QuestionModel)