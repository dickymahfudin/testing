require('dotenv').config();
const express = require('express');
const { sequelize } = require('./src/models');
const userRoutes = require('./src/routes');
const { subscribeMessages } = require('./src/messaging/subscriber');

const PORT = process.env.PORT || 5000;
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/', userRoutes);

sequelize
  .sync()
  .then(() => {
    app.listen(PORT, () => {
      subscribeMessages();
      console.log(`Server is running on port 127.0.0.1:${PORT}`);
    });
  })
  .catch(error => {
    console.error('Unable to connect to the database:', error);
  });
