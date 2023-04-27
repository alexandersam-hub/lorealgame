const {Schema, model} = require('mongoose')

const ProgressGameModel = new Schema({
        game:{type:String, required:true},
        team:{type:String, required:true},
        currentResource:{type:[Number]},
        currentRound:{type:Number},
        currentChoice:{type:String},
        currentAnswer:{type:String},
        isAnswer:{type:Boolean, default:false},
        tagging:{type:String}
})

module.exports = model('ProgressGame', ProgressGameModel)