import { sessions } from '../controllers/Session';
import { dbFindByFieldName } from './dbQuerys';
import { User } from '../models/User';

export const authorizeRequest = async (req, res) => {
  try {
    // Check that there is an authorization header
    if (!req.headers.authorization) return res.status(401).send('Missing authorization header');

    // Check that the authorization header is in the correct format
    const authorizationHeader = req.headers.authorization.split(' ');
    if (authorizationHeader.length !== 2 || authorizationHeader[0] !== 'Bearer') return res.status(400).send('Invalid authorization header');

    // Get sessionId from authorization header
    const sessionId = authorizationHeader[1];

    // Find session in sessions array
    const session = sessions.find((session) => session.id === sessionId);
    if (!session) return res.status(401).send('Invalid session');

    // Check that the user exists
    const user = await dbFindByFieldName(User, 'id', session.userId);
    if (!user) return res.status(401).send('Invalid session');

    // Add user to request object
    req.user = user;

    // Add session to request object
    req.session = session;

    return true;
  } catch (error) {
    console.log('ERROR', { message: error });
    return res.status(500).send('Error authorizing request');
  }
};
