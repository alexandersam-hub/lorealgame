const {Schema, model} = require('mongoose')

const DurationTaskModel = new Schema({
    game:{type:String, required:true},
    type:{type:String, required:true},
    title:{type:String, required:true},
    text:{type:String, required:true},
    mark:{type:String}, // дополнительные пометки для заданий, например, что оно работет с фото
    location:{type:String},
    //prices:{type:[Object]},
    changes:{type:[Object]},
    isActive:{type:Boolean, required:true, default:true},
    description:{type:String}
})

module.exports = model('Duration', DurationTaskModel)