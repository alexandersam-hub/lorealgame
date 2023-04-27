
module.exports = class GameBase{

    id
    gameName
    countRound
    typeGame
    isActive
    resourceName
    agentPrice
    timeViewScore
    startResourceCounts
    additionalResource
    timeRound
    description

    constructor(model) {
        this.id = model.id?model.id.toString():''
        this.gameName = model.gameName?model.gameName:''
        this.countRound = model.countRound?model.countRound:0
        this.typeGame = model.typeGame?model.typeGame:''
        this.timeRound = model.timeRound?model.timeRound:0
        this.agentPrice = model.agentPrice? model.agentPrice:0
        this.timeViewScore = model.timeViewScore? model.timeViewScore:0
        this.isActive = model.isActive
        this.resourceName = model.resourceName?model.resourceName:''
        this.startResourceCounts = model.startResourceCounts?model.startResourceCounts:0
        this.additionalResource = model.additionalResource?model.additionalResource:[]
        this.description = model.description?model.description:''
    }
}