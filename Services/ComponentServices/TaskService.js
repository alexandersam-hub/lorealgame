const TaskModel = require('../../Models/TaskModel')
const TaskDto = require('../../Dtos/taskDto')
const ErrorService = require('../ErrorService')
const QuestionModel = require('../../Models/QuestionModel')
const AnswerModel = require('../../Models/AnswerModel')
const AnswerDto = require('../../Dtos/AnswerDto')

class TaskService{
    async getTasks(){
        try{
            const tasksBd = await TaskModel.find()
            const tasks = []
            for (const task of tasksBd) {
                const taskDto = new TaskDto(task)
                const questionDb = await QuestionModel.findOne({task:taskDto.id})
                taskDto.questions = questionDb && questionDb.questions?questionDb.questions:[]

                tasks.push(taskDto)
            }

            return {warning:false, tasks}
        }catch (e) {
            ErrorService.addLog(e.message, 'TaskService.getTasks')
            return {warning:true, message:'Не удалось выгрузить задания. '+ e.message}
        }
    }

    async getQuestionByTaskId(taskId){
        const questionDb = await QuestionModel.findOne({task:taskId})
        if (questionDb && questionDb.questions)
           return questionDb.questions
        else
            return []
    }

    async getTasksNotQuestions(){
        try{
            const tasksBd = await TaskModel.find()
            const tasks = []
            tasksBd.forEach(task=>tasks.push(new TaskDto(task)))
            return {warning:false, tasks}
        }catch (e) {
            ErrorService.addLog(e.message, 'TaskService.getTasks')
            return {warning:true, message:'Не удалось выгрузить задания. '+ e.message}
        }
    }

    async getTasksByGameId(gameId){
        try{
            const tasksBd = await TaskModel.find({game:gameId})
            const tasks = []
            tasksBd.forEach(task=>tasks.push(new TaskDto(task)))
            return {warning:false, tasks}
        }catch (e) {
            ErrorService.addLog(e.message, 'TaskService.getTasks')
            return {warning:true, message:'Не удалось выгрузить задания. '+ e.message}
        }
    }

    async createTask(task){
        try{
            if (task.id)
                delete(task.id)
            const taskBd = await TaskModel.create({...task})
            const taskDto = new TaskDto(taskBd)
           if (task.questions && task.questions.length>0){
                   await QuestionModel.create({task:taskDto.id, questions:task.questions})
               return {warning:false, task: {...taskDto, questions:task.questions}}
           }
            return {warning:false, task:taskDto}
        }catch (e) {
            ErrorService.addLog(e.message, 'TaskService.createTask')
            return {warning:true, message:'Не удалось создать задание. '+ e.message}
        }
    }

    async updateTask(task){
        try{
            if (!task.id)
                return {warning:true, message:'Нe заполнено поле id.'}
            const id = task.id
            delete(task.id)
            await TaskModel.findByIdAndUpdate(id,{...task})
            const updatedTask = await TaskModel.findById(id)
            const taskDto = new TaskDto(updatedTask)
            if (task.questions && task.questions.length>0){
                if (await QuestionModel.findOne({task:taskDto.id}))
                    await QuestionModel.findOneAndUpdate({task:taskDto.id}, {questions:task.questions})
                else
                    await QuestionModel.create({task:taskDto.id, questions:task.questions})
                return {warning:false, task: {...taskDto, questions:task.questions}}
            }
            return {warning:false, task:taskDto}
        }catch (e) {
            ErrorService.addLog(e.message, 'TaskService.updateTask')
            return {warning:true, message:'Не удалось изменить задание. '+ e.message}
        }
    }

    async deleteTask(taskId){
        try{
            await TaskModel.findByIdAndDelete(taskId)
            return {warning:false}
        }catch (e) {
            ErrorService.addLog(e.message, 'TaskService.deleteGame')
            return {warning:true, message:'Не удалось удалить задание. '+ e.message}
        }
    }

    async setAnswer(taskId, userId, answer){
        try{
            const answerBd = await AnswerModel.findOne({user:userId, task: taskId})
            if (answerBd){
                await AnswerModel.findOneAndUpdate({user:userId, task: taskId}, {answer, isModeration:false})
            }else{
                await AnswerModel.create({user:userId, task: taskId, answer, isModeration:false})
            }
            return true
        }catch (e) {
            console.log(e)
            return false
        }
    }

    async setModerationAnswer(answerId){
        try{
            const answerBd = await AnswerModel.findByIdAndUpdate(answerId,{isModeration:true})
            return true
        }catch (e) {
            console.log(e)
            return false
        }
    }

    async getAnswerNotModeration(){
        try{
            const answers = []
            const answerBd = await AnswerModel.find({isModeration:false})
            answerBd.forEach(a=>answers.push(new AnswerDto(a)))
            return answers
        }catch (e) {
            console.log(e)
            return []
        }
    }
    async removeAllAnswers(){
        const answerBd = await AnswerModel.find()
        for (const a of answerBd) {
            const ad = new AnswerDto(a)
            await AnswerModel.findByIdAndRemove(ad.id)
        }


    }
}

module.exports = new TaskService()