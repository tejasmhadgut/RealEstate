import express from 'express';
import { verifyToken } from '../utils/verifyUser.js';
import { createListing } from '../controllers/listing.controller.js';

export const router = express.Router();

router.post('/create', verifyToken, createListing);

export default router;