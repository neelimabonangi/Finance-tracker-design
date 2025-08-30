import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { AITransactionParser } from '../services/aiService.js';
import Transaction from '../models/Transaction.js';

const router = express.Router();
const aiParser = new AITransactionParser();

router.post('/parse', authenticateToken, async (req, res) => {
  try {
    const { input } = req.body;
    
    if (!input || input.trim().length === 0) {
      return res.status(400).json({ message: 'Transaction input required' });
    }

    const result = await aiParser.parseTransaction(input);
    
    res.json({
      success: result.success,
      data: result.success ? result.data : result.fallback,
      originalInput: input,
      aiParsed: result.success
    });
  } catch (error) {
    console.error('Parse error:', error);
    res.status(500).json({ message: 'Failed to parse transaction' });
  }
});

router.post('/', authenticateToken, async (req, res) => {
  try {
    const { amount, type, category, description, originalInput, aiConfidence } = req.body;

    const transaction = new Transaction({
      userId: req.userId,
      amount: Math.abs(amount),
      type,
      category,
      description,
      originalInput,
      aiConfidence: aiConfidence || 1,
      verified: true
    });

    await transaction.save();
    res.status(201).json(transaction);
  } catch (error) {
    console.error('Create transaction error:', error);
    res.status(500).json({ message: 'Failed to create transaction' });
  }
});

router.get('/', authenticateToken, async (req, res) => {
  try {
    const { category, type, startDate, endDate, limit = 50 } = req.query;
    
    const filter = { userId: req.userId };
    
    if (category) filter.category = category;
    if (type) filter.type = type;
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    const transactions = await Transaction.find(filter)
      .sort({ date: -1 })
      .limit(parseInt(limit));

    res.json(transactions);
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({ message: 'Failed to get transactions' });
  }
});

router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { amount, type, category, description } = req.body;
    
    const transaction = await Transaction.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { amount: Math.abs(amount), type, category, description, verified: true },
      { new: true }
    );

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    res.json(transaction);
  } catch (error) {
    console.error('Update transaction error:', error);
    res.status(500).json({ message: 'Failed to update transaction' });
  }
});

router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const transaction = await Transaction.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId
    });

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    res.json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    console.error('Delete transaction error:', error);
    res.status(500).json({ message: 'Failed to delete transaction' });
  }
});

export default router;