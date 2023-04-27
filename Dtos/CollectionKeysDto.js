// game:{type:String, required:true},
// correctKey:{type:[String]},
// incorrectKey:{type:[String]},
// drawKey:{type:[String]},
// mark:{type:String},
// isActive:{type:Boolean, required:true, default:true}

module.exports = class CollectionGame{

    id
    game
    correctKey
    incorrectKey
    drawKey
    mark
    price
    isActive


    constructor(model) {
        this.id = model.id?model.id.toString():''
        this.game = model.game?model.game:''
        this.correctKey = model.correctKey?model.correctKey:[]
        this.incorrectKey = model.incorrectKey?model.incorrectKey:[]
        this.drawKey = model.drawKey?model.drawKey:[]
        this.price = model.price?model.price:0
        this.isActive = model.isActive
        this.mark = model.mark?model.mark:''
    }
}