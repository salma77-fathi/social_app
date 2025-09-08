import { connect } from "mongoose";
import { UserModel } from "./models/User.Model.js";

const connectDB = async (): Promise<void> => {
  try {
    const result = await connect(process.env.DB_URI as string);
    await UserModel.syncIndexes();
    console.log(result.models);
    console.log("DB connected successfully 😁");
  } catch (error) {
    console.log("fail to connected 😑");
  }
};
export default connectDB;
