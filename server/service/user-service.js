const UserModel = require('../models/user-model')
const bcrypt = require('bcrypt')
const uuid = require('uuid')
const mailService = require('../service/mail-service')
const tokenServise = require('./token-servise')
const UserDto = require('../dto/user-dto')
const ApiError =require('../exceptions/api-error')
const userModel = require('../models/user-model')

class UserService{
    async registration(email, password){
        const candidate = await UserModel.findOne({email})
        if(candidate){
            throw ApiError.BadRequest(`A user with the same email:${email} already exists`)
        }
        const hashPassword = await bcrypt.hash(password, 10)
        const activationLink = uuid.v4()
        const user = await UserModel.create({email, password:hashPassword, activationLink})
        await mailService.sendActivationMail(email, `${process.env.API_URL}/api/activate/${activationLink}`)

        const userDto = new UserDto(user) // id, email, usActivated
        const tokens = tokenServise.generationToken({...userDto})
        await tokenServise.saveToken(userDto.id, tokens.refreshToken)

        return {
            ...tokens, 
            user: userDto
        }
    }   

    async activate(activationLink){
        const user = await UserModel.findOne({activationLink})
        if (!user) {
            throw ApiError.BadRequest('unknown activated link')
        }
        user.isActivated = true
        await user.save()
    }

    async login(email, password){
        const user = await UserModel.findOne({email})
        if(!user){
            throw ApiError.BadRequest('user with so email no found')
        }
        const isPassEqals = await bcrypt.compare(password, user.password)
        if(!isPassEqals){
            throw ApiError.BadRequest('wrong password')
             }
         const userDto = new UserDto(user)
        const tokens = tokenServise.generationToken({...userDto})
        await tokenServise.saveToken(userDto.id, tokens.refreshToken)
        return {
             ...tokens, 
            user: userDto
        }
       
    }

    async logout(refreshToken){
        const token = await tokenServise.removeToken(refreshToken)
        return token
    }

    async refresh(refreshToken){
        if(!refreshToken){
            throw ApiError.UnauthorizedError()
        }
        const userData = tokenServise.validRefreshToken(refreshToken)
        const tokenFromDb = tokenServise.findoken(refreshToken)
        if(!userData || ! tokenFromDb){
            throw ApiError.UnauthorizedError()
        }
        const user = await UserModel.findById(userData.id)
        const userDto = new UserDto(user)
        const tokens = tokenServise.generationToken({...userDto})
        await tokenServise.saveToken(userDto.id, tokens.refreshToken)
        return {
             ...tokens, 
            user: userDto
        }

    }

    async getUsers() {
        const users = await UserModel.find()
        return users
    }

}

module.exports = new UserService()