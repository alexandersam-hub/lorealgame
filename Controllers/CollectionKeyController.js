const CollectionKeyService = require('../Services/ComponentServices/CollectionKeysService')
const ErrorService = require('../Services/ErrorService')

class CollectionKeyController{
    responseMessageError = {warning:true, message:'Ошибка сервера'}

    async getCollectionsKey(req,res){
        try{
            const games = await CollectionKeyService.getCollectionsKey()
            return res.json(games)
        } catch (e) {
            ErrorService.addLog(e.message, 'CollectionKeyController.getCollectionsKey')
            return res.json(this.responseMessageError)
        }
    }

    async getCollectionKeyByGameId(req,res){
        try{
            const {game_id} = req.body
            if(!game_id){
                return res.json({warning:true, message:"Не все поля заполнены верно"})
            }
            const result = await CollectionKeyService.getCollectionKeyByGameId(game_id)
            return res.json(result)
        } catch (e) {
            ErrorService.addLog(e.message, 'CollectionKeyController.updateCollectionKey')
            return res.json(this.responseMessageError)
        }

    }

    async updateCollectionKey(req,res){
        try{
            const {key} = req.body
            if(!key){
                return res.json({warning:true, message:"Не все поля заполнены верно"})
            }

            const result = await CollectionKeyService.updateCollectionKey(key)

            return res.json(result)
        } catch (e) {
            ErrorService.addLog(e.message, 'CollectionKeyController.updateCollectionKey')
            return res.json(this.responseMessageError)
        }

    }

    async addCollectionKey(req,res){
        try{
            const {key} = req.body
            if(!key){
                return res.json({warning:true, message:"Не все поля заполнены верно"})
            }
            const result = await CollectionKeyService.createCollectionKey(key)
            return res.json(result)
        } catch (e) {
            ErrorService.addLog(e.message, 'CollectionKeyController.addCollectionKey')
            return res.json(this.responseMessageError)
        }
    }

    async deleteCollectionKey(req,res){
        try {
            const {key_id} = req.body
            if(!key_id)
                return res.json({warning:true, message:"Не заполнено поле game_id"})
            const result = await CollectionKeyService.deleteCollectionKey(key_id)
            return res.json(result)
        }catch (e) {
            ErrorService.addLog(e.message, 'CollectionKeyController.deleteCollectionKey')
            return res.json(this.responseMessageError)
        }
    }

}

module.exports = new CollectionKeyController()