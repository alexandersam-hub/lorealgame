const {Schema, model} = require('mongoose')

const TaskModel = new Schema({
    type:{type:String, required:true},
    title:{type:String, required:true},
    text:{type:String},
    mark:{type:String}, // дополнительные пометки для заданий, например, что оно работет с фото
    location:{type:String},
    img:{type:String},
    price:{type:Number},
    timeDuration:{type:Number},
    countRound:{type:Number},
    reactionWin:{type:String},
    reactionLast:{type:String},
    reaction:{type:String},
    answer:{type:String},
    isActive:{type:Boolean, required:true, default:true},
    description:{type:String}
})

module.exports = model('Task', TaskModel)