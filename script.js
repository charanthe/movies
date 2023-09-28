const express = require('express');
const app = express();
const port = 3003;

app.use(express.static('public'));
app.set('view engine', 'ejs');

const { initializeApp } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const { credential } = require('firebase-admin'); // Import credential

const serviceAccount = require('./webpage.js.json');

const admin = initializeApp({
  credential: credential.cert(serviceAccount), // Use credential.cert
});

const db = getFirestore();

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/web/' + 'home.html');
});

app.get('/signupSubmit', function (req, res) {
  console.log(req.query);
  db.collection('web')
    .add({
      name: req.query.name,
      email: req.query.email,
      password: req.query.password,
    })
    .then(() => {
      res.sendFile(__dirname + '/web/' + 'login.html');
    })
    .catch(() => {
      res.send('Something went wrong');
    });
});

const omdbApiKey = 'http://www.omdbapi.com/?i=tt3896198&apikey=6af869b8';

app.get('/search', async (req, res) => {
  const title = req.query.title;

  try {
    const response = await axios.get(
      `http://www.omdbapi.com/?apikey=${omdbApiKey}&s=${title}`
    );
    const movieResults = response.data.Search || [];

    res.json(movieResults);
  } catch (error) {
    console.error('Error fetching movie data:', error.message);
    res.status(500).json({ error: 'An error occurred while fetching movie data' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
