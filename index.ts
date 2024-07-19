// Description: This is the main file of the application.
// It is responsible for starting the server and listening to the port.
import express, { Request, Response, NextFunction } from 'express';
import cookieParser from 'cookie-parser';
import mainRoute from './routes/mainRoute';
import errorHandler from './middleware/errorHandler';
import conditionalTokenValidation from './middleware/conditionalTokenValidation';
import corsConfig from './config/corsConfig';
import sessionConfig from './config/sessionConfig';
import connectDb from './config/dbConnection';
import routes from './config/routeConfig';
import { config } from './config/config';
import { API_ENDPOINTS } from './config/endpointsConfig';
import http from 'http';
import { Server } from 'socket.io';
require('dotenv').config();

const app = express();
const port = process.env.PORT || config.PORT;

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
});

app.use((req: Request, res: Response, next: NextFunction) => {
  (req as any).io = io;
  next();
});

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(corsConfig);
app.use(sessionConfig);
app.use(conditionalTokenValidation);

Object.values(routes).forEach((route) => {
  app.use(API_ENDPOINTS.MAIN.DEFAULT, route);
});

app.use(mainRoute);
app.use(errorHandler);

// io.on('connection', (socket) => {
//   console.log('A user connected');
//   socket.on('disconnect', () => {
//     console.log('User disconnected');
//   });
// });

connectDb()
  .then(() => {
    server.listen(port, () => {
      console.log(`${config.SUCCESS.SERVER} ${port}`);
    });
  })
  .catch((error) => {
    console.error(`${config.ERROR.CONNECTION_FAILED}`, error);
  });
