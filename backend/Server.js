const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sellingRoute = require('./routes/selling');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.use(sellingRoute);

const PORT = process.env.PORT || 3005;

app.listen(PORT, () => {
  console.log(`Server is running in port ${PORT}`);
});
