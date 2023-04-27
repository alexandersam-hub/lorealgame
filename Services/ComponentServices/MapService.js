const MapModel = require('../../Models/MapModel')
const MapDto = require('../../Dtos/MapDto')
const ErrorService = require('../ErrorService')

class MapService{

    async getMaps(){
        try{
            const mapsBd = await MapModel.find()
            const maps = []
            mapsBd.forEach(map=>maps.push(new MapDto(map)))
            return {warning:false, maps}
        }catch (e) {
            ErrorService.addLog(e.message, 'MapService.getMaps')
            return {warning:true, message:'Не удалось вышрузить maps. '+ e.message}
        }
    }

    async getMapsByGameId(gameId){
        try{
            console.log(gameId)
            const mapsBd = await MapModel.find({game:gameId})
           
            const maps = []
            mapsBd.forEach(map=>maps.push(new MapDto(map)))
            return {warning:false, maps}
        }catch (e) {
            ErrorService.addLog(e.message, 'MapService.getMaps')
            return {warning:true, message:'Не удалось вышрузить maps. '+ e.message}
        }
    }

    async createMap(map){
        try{
            if (map.id)
                delete(map.id)
            const mapBd = await MapModel.create({...map})
            return {warning:false, map:new MapDto(mapBd)}
        }catch (e) {
            ErrorService.addLog(e.message, 'MapService.createMap')
            return {warning:true, message:'Не удалось создать map. '+ e.message}
        }
    }

    async updateMap(map){
        try{
            if (!map.id)
                return {warning:true, message:'Нe заполнено поле id.'}
            const id = map.id
            delete(map.id)
            await MapModel.findByIdAndUpdate(id,{...map})
            const updatedMap = await MapModel.findById(id)
            return {warning:false, map:new MapDto(updatedMap)}
        }catch (e) {
            ErrorService.addLog(e.message, 'MapService.updateMap')
            return {warning:true, message:'Не удалось изменить map. '+ e.message}
        }
    }

    async deleteMap(mapId){
        try{
            await MapModel.findByIdAndDelete(mapId)
            return {warning:false}
        }catch (e) {
            ErrorService.addLog(e.message, 'MapService.deleteMap')
            return {warning:true, message:'Не удалось удалить map. '+ e.message}
        }
    }

}

module.exports = new MapService()