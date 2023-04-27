const {Router} = require('express')
const GameController = require('../Controllers/GameController')
const adminMiddleware = require('../middlewares/adminMiddleware')

const router = new Router()

router.post('/get', GameController.getGames)
router.post('/add', GameController.addGame)
router.post('/update', GameController.updateGame)
router.post('/del', GameController.deleteGame)

module.exports = router