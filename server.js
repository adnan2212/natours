const mongoose = require('mongoose');
require('dotenv').config({ path: `${__dirname}/.env` });

process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.log(err.name, err.message);
});

const app = require('./app');

// console.log(process.env);

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('DB connection successful!');
  });

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App lsitening on port ${port}...`);
});

process.on('unhandledRejection', (err) => {
  console.log('Unhandled rejection! 💥 Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    // 0 -> succes & 1 -> uncaught exception: all err or bugs that occur in synchronous code but are not handled anywhere.
    process.exit(1);
  });
});

process.on('SIGTERM', () => {
  console.log('👋 SIGTERM RECEIVED. Shutting down gracefully');
  server.close(() => {
    console.log('💥 Process terminated!');
  });
});
