import express from 'express';
import { startNewGame, submitCards, getLeaderboard, healthCheck } from '../controllers/gameController';

const router = express.Router();

router.get('/health',healthCheck);
router.post('/start', startNewGame);
router.post('/submit-cards', submitCards);
router.get('/leaderboard', getLeaderboard);

export default router;
