const {Router} = require('express')
const UserController = require('../Controllers/UserController')
const adminMiddleware = require('../middlewares/adminMiddleware')

const router = new Router()

router.post('/get', UserController.getUsers)
router.post('/get_by_game_id', UserController.getUsersByGameId)
router.post('/login', UserController.login)
router.post('/registration', UserController.registration)
router.post('/update', UserController.updateUser)
router.post('/update_password', UserController.updateUserPassword)
router.post('/del', UserController.deleteUser)

module.exports = router