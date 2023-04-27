const jwt = require('jsonwebtoken')
const tokenModel = require('../../Models/TokenModel')
require('dotenv').config()

class TokenService{

    generationToken(payload){
      //  const accessToken = jwt.sign(payload, process.env.SECRET_KEY_ACCESS, {expiresIn: '35m'} )
        const token = jwt.sign(payload, process.env.SECRET_KEY_TOKEN, {expiresIn: '30d'} )
        return token
    }

    async tokenSave(userId, refreshToken){
        const tokenData = await tokenModel.findOne({user:userId})
        if(tokenData){
            tokenData.token = refreshToken
            return tokenData.save();
        }
        const token = await tokenModel.create({user:userId, token:refreshToken})
        return token
    }

    async removeToken(refreshToken){
        const tokenData = await tokenModel.deleteOne({refreshToken})
        return tokenData
    }

    validationToken(token){
        try{
            const userData=jwt.verify(token,process.env.SECRET_KEY_TOKEN)
            return userData
        }
        catch (e) {
            return null
        }
    }
    async findToken(refreshToken){
        const tokenData = await tokenModel.findOne({refreshToken})
        return tokenData
    }

    async getRole(token){
        const tokenData = await tokenModel.findOne({refreshToken:token})
        if(tokenData)
            return tokenData.refreshToken.user.user
        else
            return null
    }
}

module.exports = new TokenService()