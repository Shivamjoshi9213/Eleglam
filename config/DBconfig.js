import mongoose from "mongoose";
import colors from "colors";

const connectDB = async () => {
  try {
    const connect = await mongoose.connect(process.env.MONGOURL);
    console.log(
      `Mongo Db connected successfully ${connect.connection.host}`.bgMagenta
    );
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

export default connectDB;
