//Youtube vide link 
//https://www.youtube.com/watch?v=9zUHg7xjIqQ&t=16271s
import express from 'express';
import mongoose from 'mongoose';
import { RedisStore } from "connect-redis"
import session from "express-session"
import { createClient } from "redis"
import cors from 'cors';

import {
  MONGO_IP,
  MONGO_PASSWORD,
  MONGO_PORT,
  MONGO_USER,
  REDIS_HOST,
  REDIS_PASSWORD,
  REDIS_PORT,
  REDIS_SESSION_SECRET
} from './src/config/config.js';

import PostRoutes from './src/routes/post.route.js';
import UserRouter from './src/routes/user.route.js';

const app = express();

app.use(cors({}));

// Initialize client.
let redisClient = createClient({
  socket: {
    host: REDIS_HOST,
    port: REDIS_PORT
  }
});
redisClient.connect().catch(console.error)

// Initialize store.
let redisStore = new RedisStore({
  client: redisClient,
  prefix: "user_session:",
})

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB connection with retry mechanism
const MONGO_URL = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/?authSource=admin`;

const connectWithRetry = () => {
  mongoose.connect(MONGO_URL)
    .then(() => console.log('Connected to MongoDB successfully'))
    .catch((err) => {
      console.error('Failed to connect to MongoDB. Retrying in 5 seconds...', err);
      setTimeout(connectWithRetry, 5000);
    });
};

connectWithRetry();

//this for specific to the nginx load balancer and if you want to get the real ip address of the requested client
app.enable('trust proxy');

// Configure session middleware
app.use(session({
  store: redisStore,
  secret: REDIS_SESSION_SECRET,
  resave: false,
  saveUninitialized: false, // Prevent creating empty sessions
  cookie: {
    secure: false, // Set to true if using HTTPS
    httpOnly: true, // Cookies not accessible via client-side scripts
    // maxAge: 3600000, // 1hr
    maxAge: 60000, // 1hr
  },
}));

// Test route for session
app.get('/api', (req, res) => {
  console.log("Running--------")
  if (req.session.views) {
    req.session.views++;
    res.send(`<h2>Welcome back! You've visited this page ${req.session.views} times.</h2>`);
  } else {
    req.session.views = 1;
    res.send('<h2>Hello! Welcome for the first time.</h2>');
  }
});

// Use routes
app.use('/api', UserRouter);
app.use('/api', PostRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});




































// import express from 'express';
// import mongoose from 'mongoose';
// import session from 'express-session';
// import { createClient } from 'redis';
// import { RedisStore } from "connect-redis"

// import { MONGO_IP, MONGO_PASSWORD, MONGO_PORT, MONGO_USER, REDIS_HOST, REDIS_PASSWORD, REDIS_PORT, REDIS_SESSION_SECRET, REDIS_USERNAME } from './src/config/config.js';
// import PostRoutes from './src/routes/post.route.js';
// import UserRouter from './src/routes/user.route.js';

// const app = express();

// // Initialize client.
// let redisClient = createClient({
//   socket: {
//     host: "redis",
//     port: 6380
//   }
// })
// redisClient.connect().catch(console.error)

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// //172.18.0.2 = IP Address of the mongo container
// // mongoose.connect("mongodb://root:example@172.18.0.2:27017/?authSource=admin")

// //mongo = service name of the mongo database image defined under docker-compose.dev.yml file
// //docker will use the defaut networking setting created for this container to mapped the ip address using the service name with the help of DNS lookup
// // mongoose.connect("mongodb://root:example@mongo:27017/?authSource=admin")

// // const MONGO_URL = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/?authSource=admin`
// // mongoose.connect(MONGO_URL)
// //   .then(() => {
// //     console.log("Database connect sucessfully")
// //   })
// //   .catch(error => {
// //     console.log("Error while connect database", error);
// //   })

// const MONGO_URL = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/?authSource=admin`

// const connectWithRetry = () => {
//   mongoose.connect(MONGO_URL)
//     .then(() => {
//       console.log("Database connect sucessfully")
//     })
//     .catch(error => {
//       console.log("Error while connect database", error);
//       setTimeout(() => {
//         connectWithRetry();
//       }, 5000);
//     })
// }

// connectWithRetry();

// //express-session setup
// app.use(session({
//   store: new RedisStore({ client: redisClient }),
//   secret: REDIS_SESSION_SECRET,
//   resave: false,
//   saveUninitialized: false,
//   cookie: {
//     secure: false,
//     httpOnly: true,
//     maxAge: 30000 //30s
//   }
// }))

// app.get('/', (req, res) => {
//   res.send('<h2>Hello From Docker 1111</h2>');
// })

// app.use('/api', UserRouter);
// app.use('/api', PostRoutes);

// const PORT = process.env.PORT || 3000;

// app.listen(PORT, () => {
//   console.log(`App running on port ${PORT}`);
// })