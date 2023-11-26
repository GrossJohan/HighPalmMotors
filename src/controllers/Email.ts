import { dbCreateEntity, dbFindByFieldName, dbUpdateEntity } from '../services/dbQuerys';
const nodemailer = require('nodemailer');
require('dotenv').config();

interface Vehicle {
  id: number;
  vin: number;
  year: number;
  make: string;
  model: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: number;
    password: string;
    email: string;
    isAdmin: boolean;
    createdAt: string;
    updatedAt: string;
  };
}

export const sendEmail = async (req, res) => {
  const { vehicle, price } = req.body as { vehicle: Vehicle; price: string };

  if (!vehicle || !price.trim()) return res.status(400).send('Email, vehicleId and price are required');

  // Check if offer already exists
  const offerExists = await dbFindByFieldName('Offer', 'vehicle.id', vehicle.id);

  if (offerExists) {
    return res.status(400).send('Offer already exists!');
  }

  // Create offer in database
  const offer = await dbCreateEntity('Offer', {
    vehicle: vehicle.id,
    user: vehicle.user.id,
    price: price.trim(),
  });

  // Update vehicle with offer
  await dbUpdateEntity('Vehicle', vehicle.id, { offer: (offer as any).id });

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.SENDER_EMAIL,
        pass: process.env.PASSWORD,
      },
    });

    const mailOptions = {
      from: {
        name: 'High Palm Motors',
        address: process.env.SENDER_EMAIL,
      },
      // to: vehicle.user.email,
      to: process.env.RECEIVER_EMAIL,
      subject: 'High Palm Motors - New offer',
      text: `You have a new offer for the vehicle ${vehicle.make} ${vehicle.model} ${vehicle.year} with the price of $${price}.
      Click here to accept the offer: http://localhost:${process.env.PORT}/bookAppointment?offerId=${(offer as any).id}`,
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({ data: (offer as any).id });
  } catch (error) {
    console.error('Error occurred:', error);
  }
};
