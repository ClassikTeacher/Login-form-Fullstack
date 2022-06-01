const jwt = require('jsonwebtoken')
const tokenModal = require('../models/token-model')

class TokenService{
    generationToken(payload){
        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {expiresIn: '30m'})
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {expiresIn: '30d'})
        return{
            accessToken,
            refreshToken
        }
    }

    async saveToken(userId, refreshToken){
        const tokenData = await tokenModal.findOne({user: userId})
        if (tokenData) {
            tokenData.refreshToken = refreshToken
            return tokenData.save()
        }
        const token = await tokenModal.create({user: userId, refreshToken})
        return token
    }

    async removeToken(refreshToken){
        const tokenData = await tokenModal.deleteOne({refreshToken})
        return tokenData
    }

    async findoken(refreshToken){
        const tokenData = await tokenModal.findOne({refreshToken})
        return tokenData
    }

    validRefreshToken(token){
        try{
            const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET)
            return userData
        } catch(e) {
            return null
        }
    }

    validAccessToken(token){
        try{
            const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET)
            return userData
        } catch(e) {
            return null
        }
    }

}

module.exports = new TokenService()