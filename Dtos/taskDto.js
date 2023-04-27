module.exports = class taskDto{
    id
    type
    title
    text
    mark
    location
    price
    timeDuration
    countRound
    img
    isActive
    description
    reactionWin
    reactionLast
    reaction
    answer

    constructor(model) {
        this.id = model.id?model.id.toString():''
        this.type= model.type?model.type:''
        this.title= model.title?model.title:''
        this.text= model.text?model.text:''
        this.mark= model.mark?model.mark:''
        this.location= model.location?model.location:''
        this.price = model.price?model.price:0
        this.isActive= model.isActive?model.isActive:false
        this.description = model.description?model.description:''
        this.timeDuration = model.timeDuration?model.timeDuration:-1
        this.countRound = model.countRound?model.countRound:-1
        this.img = model.img?model.img:''
        this.reactionWin = model.reactionWin?model.reactionWin:''
        this.reactionLast = model.reactionLast?model.reactionLast:''
        this.reaction = model.reaction?model.reaction:''
        this.answer = model.answer?model.answer:''
    }
}

// 6220b1689bd70ea0c5d4d1cb
// 6220b1689bd70ea0c5d4d1cb