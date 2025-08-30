import { supabase } from '../config/database.js';

export class Transaction {
  static async create(transactionData) {
    const { data, error } = await supabase
      .from('transactions')
      .insert([{
        user_id: transactionData.userId,
        amount: transactionData.amount,
        category: transactionData.category,
        description: transactionData.description,
        type: transactionData.type,
        confidence_score: transactionData.confidenceScore || 0.9,
        created_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  }

  static async findByUserId(userId, filters = {}) {
    let query = supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (filters.category) {
      query = query.eq('category', filters.category);
    }

    if (filters.type) {
      query = query.eq('type', filters.type);
    }

    if (filters.startDate) {
      query = query.gte('created_at', filters.startDate);
    }

    if (filters.endDate) {
      query = query.lte('created_at', filters.endDate);
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    return data || [];
  }

  static async findById(id, userId) {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    return data;
  }

  static async updateById(id, userId, updateData) {
    const { data, error } = await supabase
      .from('transactions')
      .update({
        amount: updateData.amount,
        category: updateData.category,
        description: updateData.description,
        type: updateData.type,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  }

  static async deleteById(id, userId) {
    const { data, error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  }

  static async getAnalytics(userId, timeframe = '30d') {
    const startDate = new Date();
    
    switch (timeframe) {
      case '7d':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(startDate.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(startDate.getDate() - 90);
        break;
      case '1y':
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
    }

    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .gte('created_at', startDate.toISOString());

    if (error) {
      throw error;
    }

    return data || [];
  }
}

export default Transaction