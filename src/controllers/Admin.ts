const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
import { dbFindByFieldName } from '../services/dbQuerys';
import { User } from '../models/User';

export const adminSessions = [];

interface UserParams {
  email: string;
  password: string;
}

export const createAdminSession = async (req, res) => {
  // Get user data from request body
  const { email, password } = req.body as UserParams;

  // Validate email and password
  if (!email.trim() || !password.trim()) return res.status(400).send('Email and password are required');

  const user = await dbFindByFieldName(User, 'email', email.trim());

  if (!user) return res.status(404).send('User not found');

  // Check if user is admin
  if (!user.isAdmin) return res.status(401).send('User is not admin');

  // Compare password
  try {
    if (await bcrypt.compare(password.trim(), user.password)) {
      // Check if session already exists
      const session2 = adminSessions.find((session) => session.userId === user.id);
      if (session2) return res.status(200).send(session2);

      // Create session
      const session = { id: uuidv4(), userId: user.id };

      // Add session to sessions array
      adminSessions.push(session);

      // Send session to client
      res.status(201).send(session);
    } else {
      res.status(401).send('Invalid password');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
};
