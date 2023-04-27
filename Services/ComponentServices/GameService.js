const GameModel = require('../../Models/GameModel')
const GameDto = require('../../Dtos/GameDto')
const ErrorService = require('../ErrorService')

class GameService{

    async getGames(){
        try{
            const gamesBd = await GameModel.find()
            const games = []
            gamesBd.forEach(game=>games.push(new GameDto(game)))
            return {warning:false, games}
        }catch (e) {
            ErrorService.addLog(e.message, 'GameService.getGames')
            return {warning:true, message:'Не удалось вышрузить игры. '+ e.message}
        }
    }

    async createGame(game){
        try{
            if (game.id)
                delete(game.id)
            const gameBd = await GameModel.create({...game})
            return {warning:false, game:new GameDto(gameBd)}
        }catch (e) {
            ErrorService.addLog(e.message, 'GameService.createGame')
            return {warning:true, message:'Не удалось создать игру. '+ e.message}
        }
    }

    async updateGame(game){
        try{
            if (!game.id)
                return {warning:true, message:'Нe заполнено поле id.'}
            const id = game.id
            delete(game.id)
            await GameModel.findByIdAndUpdate(id,{...game})
            const updatedGame = await GameModel.findById(id)
            return {warning:false, game:new GameDto(updatedGame)}
        }catch (e) {
            ErrorService.addLog(e.message, 'GameService.updateGame')
            return {warning:true, message:'Не удалось изменить игру. '+ e.message}
        }
    }

    async deleteGame(gameId){
        try{
            await GameModel.findByIdAndDelete(gameId)
            return {warning:false}
        }catch (e) {
            ErrorService.addLog(e.message, 'GameService.deleteGame')
            return {warning:true, message:'Не удалось удалить игру. '+ e.message}
        }
    }

    async getGamesByGameId(gameId){
        try{
            const gamesBd = await GameModel.findById(gameId)
            if (gamesBd)
                return {warning:false, game:new GameDto(gamesBd)}
            else
                return {warning:true, message:'нет игры с id '+ gameId}
        }catch (e) {
            ErrorService.addLog(e.message, 'GameService.getGamesByGameId')
            return {warning:true, message:'Не удалось вышрузить игру. '+ e.message}
        }
    }

}

module.exports = new GameService()