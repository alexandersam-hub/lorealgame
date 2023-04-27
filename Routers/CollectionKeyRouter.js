const {Router} = require('express')
const CollectionKeyController = require('../Controllers/CollectionKeyController')
const adminMiddleware = require('../middlewares/adminMiddleware')

const router = new Router()

router.post('/get_by_game_id', CollectionKeyController.getCollectionKeyByGameId)
router.post('/get', CollectionKeyController.getCollectionsKey)
router.post('/add', CollectionKeyController.addCollectionKey)
router.post('/update', CollectionKeyController.updateCollectionKey)
router.post('/del', CollectionKeyController.deleteCollectionKey)


module.exports = router