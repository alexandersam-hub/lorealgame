const DurationTaskModel = require('../../Models/DurationTaskModel')
const DurationTaskDto = require('../../Dtos/DurationTaskDto')
const ErrorService = require('../ErrorService')

class DurationTaskService{

    async getDurationTasks(){
        try{
            const tasksBd = await DurationTaskModel.find()
            const tasks = []
            tasksBd.forEach(task=>tasks.push(new DurationTaskDto(task)))
            return {warning:false, tasks}
        }catch (e) {
            ErrorService.addLog(e.message, 'DurationTaskService.getDurationTasks')
            return {warning:true, message:'Не удалось выгрузить задания. '+ e.message}
        }
    }

    async getDurationTasksByGameId(gameId){
        try{
            const tasksBd = await DurationTaskModel.find({game:gameId})
            const tasks = []
            tasksBd.forEach(task=>tasks.push(new DurationTaskDto(task)))
            return {warning:false, tasks}
        }catch (e) {
            ErrorService.addLog(e.message, 'DurationTaskService.getDurationTasksByGameId')
            return {warning:true, message:'Не удалось выгрузить задания. '+ e.message}
        }
    }

    async createDurationTask(task){
        try{
            if (task.id)
                delete(task.id)
            const taskBd = await DurationTaskModel.create({...task})
            return {warning:false, task:new DurationTaskDto(taskBd)}
        }catch (e) {
            ErrorService.addLog(e.message, 'DurationTaskService.createTask')
            return {warning:true, message:'Не удалось создать задание. '+ e.message}
        }
    }

    async updateDurationTask(task){
        try{
            if (!task.id)
                return {warning:true, message:'Нe заполнено поле id.'}
            const id = task.id
            delete(task.id)
            await DurationTaskModel.findByIdAndUpdate(id,{...task})
            const updatedTask = await DurationTaskModel.findById(id)
            return {warning:false, task:new DurationTaskDto(updatedTask)}
        }catch (e) {
            ErrorService.addLog(e.message, 'DurationTaskService.updateTask')
            return {warning:true, message:'Не удалось изменить задание. '+ e.message}
        }
    }

    async deleteDurationTask(taskId){
        try{
            await DurationTaskModel.findByIdAndDelete(taskId)
            return {warning:false}
        }catch (e) {
            ErrorService.addLog(e.message, 'DurationTaskService.deleteGame')
            return {warning:true, message:'Не удалось удалить задание. '+ e.message}
        }
    }
}

module.exports = new DurationTaskService()