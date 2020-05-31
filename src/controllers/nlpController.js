import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';

import { body, param, query } from 'express-validator';
import { logger } from '../utils/logger';
import { validateReqMiddleware } from '../middleware/validateMiddleware';
import {
  summarizeUrl,
  getArticle,
  summarizeText,
} from '../services/nlpService';

const routes = Router();

routes.get('/', async (req, res) => {
  res.json({ message: 'Welcome to sample controller!' });
});

/**
 * GET custom ID
 */
routes.post(
  '/summarize',
  [body('url').optional().isString(), body('text').optional().isString()],
  validateReqMiddleware,
  async (req, res) => {
    try {
      const { url, text } = req.body;

      if (!url && !text) {
        throw new Error('Please provide either a URL, or text to summarize');
      }

      if (url) {
        const summarizedJson = await summarizeUrl(url);
        return res.json(summarizedJson);
      }

      // Fallback
      const summarizedText = await summarizeText(text);
      return res.json(summarizedText);
    } catch (e) {
      return res.status(400).json({
        description: e.message,
        status: 'failed',
      });
    }
  }
);

export default routes;
