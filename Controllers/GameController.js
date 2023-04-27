const GameService = require('../Services/ComponentServices/GameService')
const ErrorService = require('../Services/ErrorService')

class GameController{
    responseMessageError = {warning:true, message:'Ошибка сервера'}

    async getGames(req,res){
        try{
            const games = await GameService.getGames()
            return res.json(games)
        } catch (e) {
            ErrorService.addLog(e.message, 'GameController.getGames')
            return res.json(this.responseMessageError)
        }
    }

    async updateGame(req,res){
        try{
            const {game} = req.body
            if(!game){
                return res.json({warning:true, message:"Не все поля заполнены верно"})
            }

            const result = await GameService.updateGame(game)

            return res.json(result)
        } catch (e) {
            ErrorService.addLog(e.message, 'GameController.updateGame')
            return res.json(this.responseMessageError)
        }

    }

    async addGame(req,res){
        try{
            const {game} = req.body
            if(!game){
                return res.json({warning:true, message:"Не все поля заполнены верно"})
            }
            const result = await GameService.createGame(game)
            return res.json(result)
        } catch (e) {
            ErrorService.addLog(e.message, 'GameController.addGame')
            return res.json(this.responseMessageError)
        }
    }

    async deleteGame(req,res){
        try {
            const {game_id} = req.body
            if(!game_id)
                return res.json({warning:true, message:"Не заполнено поле game_id"})
            const result = await GameService.deleteGame(game_id)
            return res.json(result)
        }catch (e) {
            ErrorService.addLog(e.message, 'GameController.deleteGame')
            return res.json(this.responseMessageError)
        }
    }

}

module.exports = new GameController()