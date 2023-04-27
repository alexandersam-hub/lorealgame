const ConfigGameModel = require('../Models/ConfigGame')

class ConfigGameService {

    async getConfigAndProgress(){
        const result = await ConfigGameModel.findOne({})
        if (result)
            return result.progress
        else
            return null
    }

    async saveConfigAndProgress(progress){
        if (await ConfigGameModel.findOne({}))
            await ConfigGameModel.findOneAndUpdate({},{progress})
        else
            await ConfigGameModel.create({progress})
    }

    async removeProgress(){
        await ConfigGameModel.findOneAndRemove({})
    }

}

module.exports = new ConfigGameService()