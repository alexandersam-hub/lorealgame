module.exports = class AnswerDto{

    id
    task
    user
    answer
    isModeration

    constructor(model) {
        this.id = model.id?model.id.toString():''
        this.task = model.task?model.task:''
        this.user = model.user?model.user:''
        this.answer = model.answer?model.answer:''
        this.isModeration = model.isModeration
    }
}
