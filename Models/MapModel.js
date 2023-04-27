const {Schema, model} = require('mongoose')

const MapModel = new Schema({
    game:{type:String, required:true},
    team:{type:String, required:true},
    tasks:{type:[[String]], required:true},
    isActive:{type:Boolean, required:true, default:true}
})

module.exports = model('Map', MapModel)