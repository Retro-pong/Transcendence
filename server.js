const express = require('express');
const path = require('path');

const app = express();

app.use('/js', express.static(path.resolve(__dirname, 'src', 'js')));

app.get('/*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'src', 'index.html'));
});

app.listen(process.env.PORT || 3000, () => console.log('Server is running...'));

// api 예시입니다 maybe?
// const bodyParser = require('body-parser');
// const data = require('./data.json');

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

// app.get('/api', (req, res) => {
//   res.json(data);
// }
