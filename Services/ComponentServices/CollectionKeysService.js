const CollectionKeyModel = require('../../Models/CollectionsKeysModel')
const CollectionKeyDto = require('../../Dtos/CollectionKeysDto')
const ErrorService = require('../ErrorService')

class CollectionKeysService {

    async getCollectionsKey(){
        try{
            const keysBd = await CollectionKeyModel.find()
            const keys = []
            keysBd.forEach(key=>keys.push(new CollectionKeyDto(key)))
            return {warning:false, keys}
        }catch (e) {
            ErrorService.addLog(e.message, 'CollectionKeysService.getCollectionsKey')
            return {warning:true, message:'Не удалось вышрузить коллекцию ключей. '+ e.message}
        }
    }

    async createCollectionKey(key){
        try{
            if (key.id)
                delete(key.id)
            const keyBd = await CollectionKeyModel.create({...key})
            return {warning:false, keys:new CollectionKeyDto(keyBd)}
        }catch (e) {
            ErrorService.addLog(e.message, 'CollectionKeysService.createCollectionKey')
            return {warning:true, message:'Не удалось создать коллекцию ключей. '+ e.message}
        }
    }

    async updateCollectionKey(key){
        try{
            if (!key.id)
                return {warning:true, message:'Нe заполнено поле id.'}
            const id = key.id
            delete(key.id)
            await CollectionKeyModel.findByIdAndUpdate(id,{...key})
            const updatedCollection = await CollectionKeyModel.findById(id)
            return {warning:false, keys:new CollectionKeyDto(updatedCollection)}
        }catch (e) {
            ErrorService.addLog(e.message, 'CollectionKeysService.updateCollectionKey')
            return {warning:true, message:'Не удалось изменить коллекцию ключей. '+ e.message}
        }
    }

    async deleteCollectionKey(keyId){
        try{
            await CollectionKeyModel.findByIdAndDelete(keyId)
            return {warning:false}
        }catch (e) {
            ErrorService.addLog(e.message, 'CollectionKeysService.deleteGame')
            return {warning:true, message:'Не удалось удалить коллекцию ключей. '+ e.message}
        }
    }

    async getCollectionKeyByGameId(gameId){
        try{
            const keyBd = await CollectionKeyModel.findOne({game:gameId})
            if (keyBd)
                return {warning:false, keys:new CollectionKeyDto(keyBd)}
            else
                return {warning:true, message:'нет коллекции ключей для игры '+ gameId}
        }catch (e) {
            ErrorService.addLog(e.message, 'CollectionKeysService.getCollectionKeyByGameId')
            return {warning:true, message:'Не удалось вышрузить коллекцию ключей. '+ e.message}
        }
    }

}

module.exports = new CollectionKeysService()