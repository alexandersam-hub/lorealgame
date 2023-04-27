const userService = require('../Services/ComponentServices/userService')
const ErrorService = require('../Services/ErrorService')

class UserController{

    responseMessageError = {warning:true, message:'Ошибка сервера'}

    async registration(req,res){
        try{
            const {name, lastname} = req.body
            const result = await userService.registration(name, lastname)
            return res.json(result)
        } catch (e) {
            ErrorService.addLog(e.message, 'UserController.registration')
            return res.json(this.responseMessageError)
        }
    }

    async updateUser(req,res){
        try{
            const {user} = req.body

            const userData = await userService.updateUser(user)
            return res.json(userData)
        } catch (e) {
            ErrorService.addLog(e.message, 'UserController.updateUser')
            return res.json(this.responseMessageError)
        }
    }

    async login(req,res){
        try{
            const {username, password} = req.body
            if (!username || !password)
                return res.json({warning:true, message:'Не заполнено поле login или password'})
            const userData = await userService.login(username, password)
            return res.json(userData)
        } catch (e) {
            ErrorService.addLog(e.message, 'UserController.updateUser')
            return res.json(this.responseMessageError)
        }
    }

    async getUsers(req,res){
        try{
            const users = await userService.getAllUsers()
            return res.json(users)
        } catch (e) {
            ErrorService.addLog(e.message, 'UserController.getUsers')
            return res.json(this.responseMessageError)
        }
    }

    async getUsersByGameId(req,res){
        try{
            const {game_id} = req.body
            if(!game_id)
                return res.json({warning:true, message:'Не заполнено поле game_id'})
            const result = await userService.getUsersByGameId(game_id)
            return res.json(result)
        } catch (e) {
            ErrorService.addLog(e.message, 'UserController.getUsers')
            return res.json(this.responseMessageError)
        }
    }

    async deleteUser(req,res){
        try{
            const {user_id} = req.body
            if (!user_id)
                return res.json({warning:true, message:'Не заполнено поле user_id'})
            const users = await userService.deleteUser(user_id)
            return res.json(users)
        } catch (e) {
            ErrorService.addLog(e.message, 'UserController.getUsers')
            return res.json(this.responseMessageError)
        }
    }

    async updateUserPassword(req, res){
        try{
            const {user_id, new_password} = req.body
            if(!user_id || !new_password)
                return res.json({warning:true, message:'Не заполнено поле user_id или new_password'})
            const result = await userService.updateUserPassword(user_id,new_password)
            return res.json(result)
        }catch (e) {
            ErrorService.addLog(e.message, 'UserController.updateUserPassword')
            return res.json(this.responseMessageError)
        }
    }

}

module.exports = new UserController()