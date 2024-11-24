import axios from 'axios';
import bodyParser from 'body-parser';
import 'dotenv/config';
import express from 'express';
const app = express();
const ADVICE_API_URL = 'https://api.adviceslip.com';
const UNSPLASH_API_URL = 'https://api.unsplash.com';

let randomPhoto = {};
let advice = {};

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

const imgQueryConfig = '?topics=nature&orientation=portrait';

// Get random advice and random photo
app.get('/', async (req, res) => {
  try {
    // Advice API Request
    advice = await axios.get(ADVICE_API_URL + '/advice');

    // Unsplash API Request
    randomPhoto = await axios.get(
      UNSPLASH_API_URL + '/photos/random' + imgQueryConfig,
      {
        headers: {
          Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`,
        },
      }
    );

    res.render('index', {
      content: advice.data.slip.advice,
      photo: randomPhoto.data.urls.regular,
    });
  } catch (error) {
    res.status(505).render('index', {
      content: 'Uh oh, Something Broke...',
      photo:
        'https://cdn.pixabay.com/photo/2019/03/13/02/08/vintage-mirror-4052203_1280.jpg',
    });
    console.log(error.response.data);
  }
});

// Get random advice only
app.post('/new-advice', async (req, res) => {
  try {
    // Advice API Request
    advice = await axios.get(ADVICE_API_URL + '/advice');

    res.render('index', {
      content: advice.data.slip.advice,
      photo: randomPhoto.data.urls.regular,
    });
  } catch (error) {
    res.status(505).render('index', {
      content: 'Uh oh, Something Broke...',
      photo:
        'https://cdn.pixabay.com/photo/2019/03/13/02/08/vintage-mirror-4052203_1280.jpg',
    });
    console.log(error);
  }
});

app.post('/search', async (req, res) => {
  const { query } = req.body;
  try {
    const response = await axios.get(
      ADVICE_API_URL + '/advice/search/' + query
    );
    res.render('listOfAdvice', {
      content: response.data,
    });
  } catch (error) {
    res.status(505).render('index', {
      content: 'Uh oh, Something Broke...',
      photo:
        'https://cdn.pixabay.com/photo/2019/03/13/02/08/vintage-mirror-4052203_1280.jpg',
    });
    console.log(error);
  }
});
// *** DO NOT MODIFY THE LINES BELOW ***

// This use() will not allow requests to go beyond it
// so we place it at the end of the file, after the other routes.
// This function will catch all other requests that don't match
// any other route handlers declared before it.
// This means we can use it as a sort of 'catch all' when no route match is found.
// We use this function to handle 404 requests to pages that are not found.
app.use((req, res) => {
  res.status(404).render('index', {
    content: 'Page Not Found',
    photo:
      'https://cdn.pixabay.com/photo/2016/12/14/23/08/page-not-found-1907792_1280.jpg',
  });
});

// This use() will add an error handler function to
// catch all errors.
app.use(function (err, req, res, next) {
  res.status(500).render('index', {
    content: 'Uh oh, Something Broke...',
    photo:
      'https://cdn.pixabay.com/photo/2019/03/13/02/08/vintage-mirror-4052203_1280.jpg',
  });
  console.error(err.stack);
});

const HTTP_PORT = process.env.PORT || 8080;

function onHttpStart() {
  console.log('Express http server listening on: ' + HTTP_PORT);
}

app.listen(HTTP_PORT, onHttpStart);
