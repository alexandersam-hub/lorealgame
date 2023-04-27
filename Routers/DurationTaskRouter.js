const {Router} = require('express')
const DurationTaskController = require('../Controllers/DurationTaskController')
const adminMiddleware = require('../middlewares/adminMiddleware')

const router = new Router()

router.post('/get', DurationTaskController.getDurationTasks)
router.post('/get_by_game_id', DurationTaskController.getDurationTasksByGameId)
router.post('/add', DurationTaskController.addDurationTask)
router.post('/update', DurationTaskController.updateDurationTask)
router.post('/del', DurationTaskController.deleteDurationTask)

module.exports = router