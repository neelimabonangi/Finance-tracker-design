import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import Transaction from '../models/Transaction.js';

const router = express.Router();

router.get('/summary', authenticateToken, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const filter = { userId: req.userId };
    
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    const transactions = await Transaction.find(filter);
    
    const summary = transactions.reduce((acc, transaction) => {
      if (transaction.type === 'income') {
        acc.totalIncome += transaction.amount;
      } else {
        acc.totalExpenses += transaction.amount;
      }
      return acc;
    }, { totalIncome: 0, totalExpenses: 0 });

    summary.netSavings = summary.totalIncome - summary.totalExpenses;
    summary.transactionCount = transactions.length;

    res.json(summary);
  } catch (error) {
    console.error('Summary error:', error);
    res.status(500).json({ message: 'Failed to get summary' });
  }
});

router.get('/categories', authenticateToken, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const filter = { userId: req.userId, type: 'expense' };
    
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    const categoryData = await Transaction.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$category',
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { total: -1 } }
    ]);

    res.json(categoryData.map(item => ({
      category: item._id,
      amount: item.total,
      count: item.count
    })));
  } catch (error) {
    console.error('Categories error:', error);
    res.status(500).json({ message: 'Failed to get category data' });
  }
});

router.get('/trends', authenticateToken, async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));
    
    const trendData = await Transaction.aggregate([
      {
        $match: {
          userId: req.userId,
          date: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
            type: "$type"
          },
          total: { $sum: "$amount" }
        }
      },
      { $sort: { "_id.date": 1 } }
    ]);

    // Format data for frontend charts
    const formattedData = {};
    trendData.forEach(item => {
      const date = item._id.date;
      if (!formattedData[date]) {
        formattedData[date] = { income: 0, expenses: 0 };
      }
      formattedData[date][item._id.type === 'income' ? 'income' : 'expenses'] = item.total;
    });

    res.json(formattedData);
  } catch (error) {
    console.error('Trends error:', error);
    res.status(500).json({ message: 'Failed to get trend data' });
  }
});

export default router;