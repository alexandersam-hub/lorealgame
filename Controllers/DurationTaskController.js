const DurationTaskService = require('../Services/ComponentServices/DurationTaskService')
const ErrorService = require('../Services/ErrorService')

class TaskController{
    responseMessageError = {warning:true, message:'Ошибка сервера'}

    async getDurationTasks(req,res){
        try{
            const result = await DurationTaskService.getDurationTasks()
            return res.json(result)
        } catch (e) {
            ErrorService.addLog(e.message, 'TaskController.getTasks')
            return res.json(this.responseMessageError)
        }
    }

    async getDurationTasksByGameId(req,res){
        try{
            const {game_id} = req.body
            if (!game_id)
                return {warning:true, message:'Не заполнено полк game_id'}
            const result = await DurationTaskService.getDurationTasksByGameId(game_id)
            return res.json(result)
        } catch (e) {
            ErrorService.addLog(e.message, 'TaskController.getTasksByGameId')
            return res.json(this.responseMessageError)
        }
    }

    async updateDurationTask(req,res){
        try{
            const {task} = req.body
            if(!task)
                return res.json({warning:true, message:"Не все поля заполнены верно"})
            const result = await DurationTaskService.updateDurationTask(task)
            return res.json(result)
        } catch (e) {
            ErrorService.addLog(e.message, 'TaskController.updateTask')
            return res.json(this.responseMessageError)
        }

    }

    async addDurationTask(req,res){
        try{
            const {task} = req.body
            if(!task)
                return res.json({warning:true, message:"Не все поля заполнены верно"})
            const result = await DurationTaskService.createDurationTask(task)
            return res.json(result)
        } catch (e) {
            ErrorService.addLog(e.message, 'TaskController.addTask')
            return res.json(this.responseMessageError)
        }
    }

    async deleteDurationTask(req,res){
        try {
            const {task_id} = req.body
            if(!task_id)
                return res.json({warning:true, message:"Не заполнено поле task_id"})
            const result = await DurationTaskService.deleteDurationTask(task_id)
            return res.json(result)
        }catch (e) {
            ErrorService.addLog(e.message, 'TaskController.deleteTask')
            return res.json(this.responseMessageError)
        }
    }

}

module.exports = new TaskController()