const {Router} = require('express')
const MapController = require('../Controllers/MapController')
const adminMiddleware = require('../middlewares/adminMiddleware')

const router = new Router()

router.post('/get', MapController.getMaps)
router.post('/get_by_game_id', MapController.getMapsByGameId)
router.post('/add', MapController.addMap)
router.post('/update', MapController.updateMap)
router.post('/del', MapController.deleteMap)

module.exports = router