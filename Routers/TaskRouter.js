const {Router} = require('express')
const TaskController = require('../Controllers/TaskController')
const adminMiddleware = require('../middlewares/adminMiddleware')

const router = new Router()

router.post('/get', TaskController.getTasks)
router.post('/get_by_game_id', TaskController.getTasksByGameId)
router.post('/add', TaskController.addTask)
router.post('/update', TaskController.updateTask)
router.post('/del', TaskController.deleteTask)

module.exports = router