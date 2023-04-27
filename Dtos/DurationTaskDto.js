module.exports = class DurationTaskModel{
    id
    game
    type
    title
    text
    mark
    location
    prices
    changes
    isActive
    description

    constructor(model) {
        this.id = model.id?model.id.toString():''
        this.game = model.game?model.game:''
        this.type= model.type?model.type:''
        this.title= model.title?model.title:''
        this.text= model.text?model.text:''
        this.mark= model.mark?model.mark:''
        this.location= model.location?model.location:''
        // this.prices = model.price?model.price:[]
        this.changes = model.changes?model.changes:[]
        this.isActive= model.isActive?model.isActive:false
        this.description = model.description?model.description:''
    }
}

// 6220b1689bd70ea0c5d4d1cb
// 6220b1689bd70ea0c5d4d1cb