import dotenv from "dotenv";
import { connect } from "./db";
import app from "./app";

dotenv.config();

const port = process.env.PORT || 4000;

const start = async () => {
  try {
    await connect();
    app.listen(port, async () => {
      console.log(`Server is listening on port ${port}`);
    });
  } catch (e) {
    console.log(e);
  }
};

start();
