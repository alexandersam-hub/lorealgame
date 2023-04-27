const {Schema, model} = require('mongoose')

const ConfigGame = new Schema({
    progress:{type:Object},
})

module.exports = model('config', ConfigGame)