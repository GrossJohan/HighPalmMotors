import { dbCreateEntity, dbFindByFieldName } from '../services/dbQuerys';
import { sendEmailToAdmin } from './Email';

interface Appointment {
  date: string;
  timeRange: string;
  offerId: string;
}

export const createAppointment = async (req, res) => {
  const { date, timeRange, offerId } = req.body as Appointment;

  // Check all fields are filled
  if (!offerId || !date || !timeRange) {
    return res.status(400).send({ error: 'All fields are required' });
  }

  // convert offerId to number
  const offerIdNumber = parseInt(offerId);

  // Check if appointment with the given offerId already exists
  const existingOffer = await dbFindByFieldName('Offer', 'id', offerIdNumber);

  if (!existingOffer) {
    return res.status(400).send({ error: 'Offer with the given ID does not exist' });
  }

  const existingAppointment = await dbFindByFieldName('Appointment', 'offer', existingOffer);

  if (existingAppointment) {
    return res.status(400).send({ error: 'Appointment with the given offerId already exists' });
  }

  // Get start and end time from time range
  const [startTime, endTime] = timeRange.split('-');

  // Create appointment
  const newAppointment = await dbCreateEntity('Appointment', {
    date: date,
    startTime,
    endTime,
    offer: offerIdNumber,
  });

  await sendEmailToAdmin({}, 'newAppointment');

  res.status(201).send(newAppointment);
};
