
module.exports = class UserDto{

    id
    username
    password
    stringName
    role
    game
    type
    isActive
    description


    constructor(model) {
        this.id = model.id?model.id.toString():''
        this.username = model.username?model.username:'';
        this.password = model.password?model.password:'';
        this.stringName = model.stringName?model.stringName:'';
        this.role = model.role? model.role:'';
        this.game = model.game?model.game:'';
        this.type = model.type?model.type:'';
        this.isActive = model.isActive?model.isActive:true;
        this.description = model.description?model.description:''

    }

}