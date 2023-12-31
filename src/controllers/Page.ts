import { dbGetAllEntities } from '../services/dbQuerys';

export const servePage = async (req, res) => {
  if (req.params['page'] === 'home' || !req.params['page']) {
    res.render('home');
  } else if (req.params['page'] === 'bookAppointment') {
    res.render('bookAppointment');
  } else if (req.params['page'] === 'howItWorks') {
    res.render('howItWorks');
  } else if (req.params['page'] === 'contactUs') {
    res.render('contactUs');
  } else if (req.params['page'] === 'admin' && req.params['subpage'] === 'bookings') {
    // Get all bookings
    const bookedTimeslots = await dbGetAllEntities('Appointment', ['offer', 'offer.user', 'offer.vehicle']);
    res.render('bookings', { bookedTimeslots });
  } else if (req.params['page'] === 'admin') {
    // Get all vehicles
    const vehicles = await dbGetAllEntities('Vehicle', ['user', 'offer']);
    res.render('admin', { vehicles });
  } else {
    res.render('404');
  }
};
