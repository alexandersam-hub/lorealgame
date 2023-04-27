const UserLocalIdModel = require('../Models/UserLocalIdModel')

class UserLocalIdService {
    async getNextNumber(){
        const resultBd = await UserLocalIdModel.findOne({})
        let number
        if (resultBd) {
            number = resultBd.currentNumber + 1
            await UserLocalIdModel.findOneAndUpdate({}, {currentNumber: number})
        }
        else {
            number = 100
            await UserLocalIdModel.create({currentNumber: number})
        }
        return number
    }
}

module.exports = new UserLocalIdService()