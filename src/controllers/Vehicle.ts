import { dbCreateEntity, dbFindByFieldName } from '../services/dbQuerys';
import { Vehicle } from '../models/Vehicle';
import { authorizeRequest } from '../services/authorizeRequest';

interface CreateVehicleParams {
  vin: number;
  year: number;
  make: string;
  model: string;
}

export const createVehicle = async (req, res) => {
  // Check if user is authorized
  const authorized = await authorizeRequest(req, res);
  if (authorized !== true) return authorized;

  try {
    // Get vehicle data from request body
    const { vin, year, make, model } = req.body as CreateVehicleParams;

    // Check that all required parameters are present
    if (!vin || !year || !make.trim() || !model.trim()) {
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

    // Create vehicle
    const vehicle = await dbCreateEntity('Vehicle', {
      vin: vin,
      year: year,
      make: make.trim() ?? '',
      model: model.trim() ?? '',
      user: req.user.id,
    });

    return res.status(200).json({ data: vehicle });
  } catch (error) {
    console.log('ERROR', { message: error });

    return res.status(500).json({ message: 'Could not create vehicle!' });
  }
};
