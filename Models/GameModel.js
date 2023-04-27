const {Schema, model} = require('mongoose')

const GameModel = new Schema({
    gameName:{type:String, unique:true, required:true},
    countRound:{type:Number, required:true},
    typeGame:{type:String},
    isActive:{type:Boolean, required:true, default:false},
    resourceName:{type:String,  required:true},
    startResourceCounts:{type:Number},
    additionalResource:{type:[Object]},
    agentPrice:{type:Number},
    timeViewScore:{type:Number},
    timeRound:{type:Number},
    mapImg:{type:String},
    description:{type:String}
})
module.exports = model('Game', GameModel)