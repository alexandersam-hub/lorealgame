const TaskService = require('../Services/ComponentServices/TaskService')
const ErrorService = require('../Services/ErrorService')

class TaskController{
    responseMessageError = {warning:true, message:'Ошибка сервера'}

    async getTasks(req,res){
        try{
            const result = await TaskService.getTasks()
            return res.json(result)
        } catch (e) {
            ErrorService.addLog(e.message, 'TaskController.getTasks')
            return res.json(this.responseMessageError)
        }
    }

    async getTasksByGameId(req,res){
        try{
            const {game_id} = req.body
            if (!game_id)
                return {warning:true, message:'Не заполнено полк game_id'}
            const result = await TaskService.getTasksByGameId(game_id)
            return res.json(result)
        } catch (e) {
            ErrorService.addLog(e.message, 'TaskController.getTasksByGameId')
            return res.json(this.responseMessageError)
        }
    }

    async updateTask(req,res){
        try{
            const {task} = req.body
            if(!task)
                return res.json({warning:true, message:"Не все поля заполнены верно"})
            const result = await TaskService.updateTask(task)
            return res.json(result)
        } catch (e) {
            ErrorService.addLog(e.message, 'TaskController.updateTask')
            return res.json(this.responseMessageError)
        }

    }

    async addTask(req,res){
        try{
            const {task} = req.body
            if(!task)
                return res.json({warning:true, message:"Не все поля заполнены верно"})
            const result = await TaskService.createTask(task)
            return res.json(result)
        } catch (e) {
            ErrorService.addLog(e.message, 'TaskController.addTask')
            return res.json(this.responseMessageError)
        }
    }

    async deleteTask(req,res){
        try {
            const {task_id} = req.body
            if(!task_id)
                return res.json({warning:true, message:"Не заполнено поле task_id"})
            const result = await TaskService.deleteTask(task_id)
            return res.json(result)
        }catch (e) {
            ErrorService.addLog(e.message, 'TaskController.deleteTask')
            return res.json(this.responseMessageError)
        }
    }

}

module.exports = new TaskController()