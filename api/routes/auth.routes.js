import express from 'express';
import  {signup, signin}  from '../controllers/auth.controller.js';

export const router = express.Router();

router.post('/signup', signup);
router.post("/signin",signin);

export default router;