import { dbCreateEntity, dbFindByFieldName } from '../services/dbQuerys';

export const checkIfUserExists = async (emailAddress, zipCode, phoneNumber) => {
  // Check if user exists
  const userExists = await dbFindByFieldName('User', 'email', emailAddress);

  // If user does not exist, create user
  if (!userExists) {
    const user = await dbCreateEntity('User', {
      email: emailAddress,
      zipCode: zipCode,
      phoneNumber: phoneNumber,
    });
  }

  // get user id
  return await dbFindByFieldName('User', 'email', emailAddress);
};
