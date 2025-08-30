import jwt from 'jsonwebtoken';
import axios from 'axios';
import User from '../models/User.js';

export class AuthService {
  static generateToken(userId) {
    return jwt.sign(
      { userId },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
  }

  static verifyToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      throw new Error('Invalid token');
    }
  }

  static async verifyGoogleToken(accessToken) {
    try {
      const response = await axios.get(
        `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${accessToken}`
      );
      return response.data;
    } catch (error) {
      throw new Error('Invalid Google token');
    }
  }

  static async findOrCreateUser(googleUser) {
    try {
      let user = await User.findOne({ googleId: googleUser.id });
      
      if (!user) {
        user = new User({
          googleId: googleUser.id,
          email: googleUser.email,
          name: googleUser.name,
          picture: googleUser.picture
        });
        await user.save();
      }
      
      return user;
    } catch (error) {
      throw new Error('Failed to create or find user');
    }
  }
}