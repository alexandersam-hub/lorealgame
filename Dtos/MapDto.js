module.exports = class MapDro{
    id
    game
    team
    tasks
    isActive

    constructor(model) {
        this.id = model.id?model.id:null
        this.team = model.team.toString()
        this.game = model.game.toString()
        this.tasks = model.tasks?model.tasks:[]
        this.isActive = model.isActive
    }
}
