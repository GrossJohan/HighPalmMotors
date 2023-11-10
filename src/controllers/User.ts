const bcrypt = require('bcrypt');
import { User } from '../models/User';
import { dbCreateEntity, dbFindByFieldName } from '../services/dbQuerys';

interface CreateUserParams {
  email: string;
  password: string;
}

export const createUser = async (req, res) => {
  try {
    // Get user data from request body
    const { email, password } = req.body as CreateUserParams;

    // Check that all required parameters are present
    if (!email.trim() || !password.trim()) {
      return res.status(400).send('Email and password are required!');
    }

    // Validate email and check if it already exists
    if (!email.match(/^[+a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/)) {
      return res.status(400).send('Email must be in a valid format!');
    }

    const userExists = await dbFindByFieldName(User, 'email', email);

    if (userExists) {
      return res.status(400).send('Email already exists!');
    }

    // Validate password
    if (password.length < 8) {
      return res.status(400).send('Password must be at least 8 characters long!');
    }

    // Hash password
    let hashedPassword;
    try {
      hashedPassword = await bcrypt.hash(password, 10);
    } catch (error) {
      console.log('ERROR', { message: error });
      return res.status(500).send('Could not create user!');
    }

    const user = await dbCreateEntity('User', {
      email: email.trim() ?? '',
      password: hashedPassword,
    });

    return res.status(200).json({ data: user });
  } catch (error) {
    console.log('ERROR', { message: error });

    return res.status(500).json({ message: 'Could not create user!' });
  }
};
