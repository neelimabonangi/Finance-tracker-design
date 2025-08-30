import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export class AITransactionParser {
  constructor() {
    this.model = genAI.getGenerativeModel({ model: "gemini-pro" });
  }

  async parseTransaction(input) {
    try {
      const prompt = `
        Parse this financial transaction input and extract the following information:
        
        Input: "${input}"
        
        Extract:
        1. Amount (number only, no currency symbol)
        2. Type (either "income" or "expense") 
        3. Category (one of: Food, Transportation, Shopping, Entertainment, Bills, Healthcare, Education, Travel, Electronics, Gas, Groceries, Income, Other)
        4. Description (clean, descriptive text)
        5. Confidence (0-1 scale for how confident you are in the parsing)
        
        Respond ONLY with valid JSON in this exact format:
        {
          "amount": number,
          "type": "income" | "expense", 
          "category": "string",
          "description": "string",
          "confidence": number
        }
        
        Rules:
        - If amount is not clear, set confidence to 0.3 or lower
        - Income indicators: salary, paid, earned, bonus, refund, deposit
        - Expense is default unless income indicators present
        - Keep descriptions concise but informative
        - If input mentions specific store/restaurant, include in description
      `;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Clean the response and parse JSON
      const cleanedText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const parsed = JSON.parse(cleanedText);
      
      // Validate the parsed result
      if (typeof parsed.amount !== 'number' || 
          !['income', 'expense'].includes(parsed.type) ||
          typeof parsed.description !== 'string' ||
          typeof parsed.confidence !== 'number') {
        throw new Error('Invalid parsing result format');
      }

      return {
        success: true,
        data: parsed
      };
    } catch (error) {
      console.error('AI parsing error:', error);
      return {
        success: false,
        error: 'Failed to parse transaction',
        fallback: this.createFallbackParsing(input)
      };
    }
  }

  createFallbackParsing(input) {
    // Simple regex-based fallback parsing
    const amountMatch = input.match(/\$?(\d+(?:\.\d{2})?)/);
    const amount = amountMatch ? parseFloat(amountMatch[1]) : 0;
    
    const incomeKeywords = ['salary', 'paid', 'earned', 'bonus', 'refund', 'deposit'];
    const type = incomeKeywords.some(keyword => 
      input.toLowerCase().includes(keyword)
    ) ? 'income' : 'expense';
    
    return {
      amount,
      type,
      category: 'Other',
      description: input.trim(),
      confidence: 0.2
    };
  }
}