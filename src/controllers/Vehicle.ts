import { dbCreateEntity, dbFindByFieldName } from '../services/dbQuerys';
import { Vehicle } from '../models/Vehicle';
import { checkIfUserExists } from './User';
import { sendEmailToAdmin } from './Email';

interface CreateVehicleParams {
  vin: number;
  year: number;
  make: string;
  model: string;
  accident: string;
  issue: string;
  clearTitle: string;
  odometer: number;
}

interface CreateUserParams {
  emailAddress: string;
  zipCode: number;
  phoneNumber: number;
}

export const createVehicle = async (req, res) => {
  try {
    // Get vehicle data from request body
    const { vin, year, make, model, accident, issue, clearTitle, odometer } = req.body.vehicleInfo as CreateVehicleParams;
    const { emailAddress, zipCode, phoneNumber } = req.body.user as CreateUserParams;

    // Validation
    const requiredFields = [vin, year, make, model, accident, issue, clearTitle, odometer, emailAddress, zipCode, phoneNumber];

    // Validate required fields
    if (requiredFields.includes('')) {
      return res.status(400).send('All fields are required!');
    }

    // Validate year
    let currentYear = new Date().getFullYear();

    if (year < 1900 || year > currentYear) {
      return `Year must be between 1900 and ${currentYear}`;
    }

    // Validate vin and check if it already exists
    if (vin.toString().length !== 17) {
      return res.status(400).send('Vin must be 17 digits!');
    }

    const vinExists = await dbFindByFieldName(Vehicle, 'vin', vin);

    if (vinExists) {
      return res.status(400).send('Vin already exists!');
    }

    // Validate odometer
    if (odometer < 0) {
      return res.status(400).send('Odometer must be greater than 0!');
    }

    // Validate clear title
    if (clearTitle !== 'yes' && clearTitle !== 'no') {
      return res.status(400).send('Clear title must be Yes or No!');
    }

    // Validate email
    if (!emailAddress.includes('@')) {
      return res.status(400).send('Invalid email address!');
    }

    const user = await checkIfUserExists(emailAddress, zipCode, phoneNumber);

    const vehicle = await dbCreateEntity('Vehicle', {
      vin: vin,
      year: year,
      make: make.trim() ?? '',
      model: model.trim() ?? '',
      accident: accident.trim() ?? '',
      issue: issue.trim() ?? '',
      clearTitle: clearTitle.trim() ?? '',
      odometer: odometer,
      user: user.id,
    });

    const data = {
      vehicle: req.body.vehicleInfo,
      user: req.body.user,
    };

    // Notify admin
    await sendEmailToAdmin(data, 'newVehicle');

    return res.status(200).json({ data: vehicle });
  } catch (error) {
    console.log('ERROR', { message: error });

    return res.status(500).json({ message: 'Could not create vehicle!' });
  }
};
