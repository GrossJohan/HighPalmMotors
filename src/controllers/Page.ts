export const servePage = async (req, res) => {
  if (req.params['page'] === 'home' || !req.params['page']) {
    res.render('home');
  } else if (req.params['page'] === 'bookAppointment') {
    res.render('bookAppointment');
  } else if (req.params['page'] === 'howItWorks') {
    res.render('howItWorks');
  } else if (req.params['page'] === 'contactUs') {
    res.render('contactUs');
  } else {
    res.render('404');
  }
};
