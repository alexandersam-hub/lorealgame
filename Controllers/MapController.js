const MapService = require('../Services/ComponentServices/MapService')
const ErrorService = require('../Services/ErrorService')

class MapController{
    responseMessageError = {warning:true, message:'Ошибка сервера'}

    async getMaps(req,res){
        try{
            const result = await MapService.getMaps()
            return res.json(result)
        } catch (e) {
            ErrorService.addLog(e.message, 'MapController.getMaps')
            return res.json(this.responseMessageError)
        }
    }

    async getMapsByGameId(req,res){
        try{
            const {game_id} = req.body
            if (!game_id)
                return {warning:true, message:'Не заполнено полк game_id'}
            const result = await MapService.getMapsByGameId(game_id)
            return res.json(result)
        } catch (e) {
            ErrorService.addLog(e.message, 'MapController.getMapsByGameId')
            return res.json(this.responseMessageError)
        }
    }

    async updateMap(req,res){
        try{
            const {map} = req.body
            if(!map)
                return res.json({warning:true, message:"Не все поля заполнены верно"})
            const result = await MapService.updateMap(map)
            return res.json(result)
        } catch (e) {
            ErrorService.addLog(e.message, 'MapController.updateMap')
            return res.json(this.responseMessageError)
        }

    }

    async addMap(req,res){
        try{
            const {map} = req.body
            console.log(map)
            if(!map)
                return res.json({warning:true, message:"Не все поля заполнены верно"})
            const result = await MapService.createMap(map)
            return res.json(result)
        } catch (e) {
            ErrorService.addLog(e.message, 'MapController.addMap')
            return res.json(this.responseMessageError)
        }
    }

    async deleteMap(req,res){
        try {
            const {map_id} = req.body
            if(!map_id)
                return res.json({warning:true, message:"Не заполнено поле map_id"})
            const result = await MapService.deleteMap(map_id)
            return res.json(result)
        }catch (e) {
            ErrorService.addLog(e.message, 'MapController.deleteMap')
            return res.json(this.responseMessageError)
        }
    }

}

module.exports = new MapController()