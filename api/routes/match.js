const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const matchControllers = require('../controllers/matchController');

router.post('/sendmatchrequest',checkAuth,matchControllers.sendMatchRequest);
router.put('/acceptmatchrequest',checkAuth,matchControllers.acceptMatchRequest);
router.put('/blockaccepteduser',checkAuth,matchControllers.blockAcceptedUser);
router.put('/unblockaccepteduser',checkAuth,matchControllers.unblockAcceptedUser);
router.delete('/rejectMatchRequest',checkAuth,matchControllers.rejectMatchRequest);

module.exports = router;