// Description: This is the main file of the application.
// It is responsible for starting the server and listening to the port.
import express from "express";
import cookieParser from "cookie-parser";
import mainRoute from "./routes/mainRoute";
import errorHandler from "./middleware/errorHandler";
import conditionalTokenValidation from "./middleware/conditionalTokenValidation";
import corsConfig from "./config/corsConfig";
import sessionConfig from "./config/sessionConfig";
import connectDb from "./config/dbConnection";
import routes from "./config/routeConfig";
import { config } from "./config/config";
import { API_ENDPOINTS } from "./config/endpointsConfig";
require("dotenv").config();
const app = express();
const port = process.env.PORT || config.PORT;

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

connectDb()
  .then(() => {
    app.listen(port, () => {
      console.log(`${config.SUCCESS.SERVER} ${port}`);
    });
  })
  .catch((error) => {
    console.error(`${config.ERROR.CONNECTION_FAILED}`, error);
  });
