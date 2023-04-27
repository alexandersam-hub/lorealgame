const {Schema, model} = require('mongoose')

const UserLocalIdModel = new Schema({
    currentNumber:{type:Number},
})

module.exports = model('userlocalid', UserLocalIdModel)