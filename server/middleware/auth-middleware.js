const ApiError = require('../exceptions/api-error')
const tokenServise = require('../service/token-servise')


module.exports = function (req, res, next){
    try{
        const authorizationHeader = req.headers.authorization
        if(!authorizationHeader){
            return next(ApiError.UnauthorizedError())
        }
        const accessToken = authorizationHeader.split(' ')[1]
        if(!accessToken){
            return next(ApiError.UnauthorizedError()) 
        }

        const userData = tokenServise.validAccessToken(accessToken)
        if(!userData){
            return next(ApiError.UnauthorizedError()) 
        }
        req.user = userData
        next()
    } catch{
        return next(ApiError.UnauthorizedError())
    }
}