app.post('/signupSubmit', (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmpassword;

  // You can add validation here if needed

  // Check if passwords match
  if (password !== confirmPassword) {
    res.send('Passwords do not match');
    return;
  }

  // Save data to Firebase Firestore
  db.collection('web').add({
    name: name,
    email: email,
    password: password
  })
  .then(() => {
    res.render('signupSubmit.html'); // or any other success response
  })
  .catch(error => {
    console.error('Error adding document: ', error);
    res.send('Error signing up');
  });
});
