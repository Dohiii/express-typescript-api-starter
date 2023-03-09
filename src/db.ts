import mongoose, { ConnectOptions } from "mongoose";
import dotenv from "dotenv";

dotenv.config();

// const options: ConnectOptions = {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// };

async function connect() {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/test",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      } as ConnectOptions
    );
  } catch (error) {
    console.log(process.env.MONGODB_URI);
    console.error("Failed to connect to MongoDB", error);
  }
}

export { connect };
