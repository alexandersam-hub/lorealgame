

module.exports = class ProgressGameDto{
    id
    game
    team
    currentResource
    choice
    answer
    isAnswer
    tagging
    isChoice

    constructor(model) {
        this.id = model.id?model.id:null
        this.team = model.team
        this.game = model.game
        this.currentResource = model.currentResource
        this.choice = model.choice
        this.answer = model.answer
        this.isAnswer = model.isAnswer
        this.tagging = model.tagging
        this.isChoice = model.isChoice
    }
}
