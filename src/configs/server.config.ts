import mongoose, { Mongoose } from "mongoose";
import AppConfig from "./app.config";

class DatabaseConnection {
  db:Mongoose = mongoose;

  /*** @description Connect to MongoDB server  */
  constructor() { this.databaseConnection() }

  /*** @description Establish database connection */
  private async databaseConnection() {
    await mongoose.connect(AppConfig.server.DATABASE_URL, { retryWrites: true, w: "majority" })
      .then(connect => console.log(`DATASOURCE:${connect.connection.host}\nDATABASE:${connect.connection.name}`))
      .catch(error => console.error(error))
  }

  /*** @description Disconnect from server */
  async disconnect() {
    await this.db.disconnect();
  }
}

export default DatabaseConnection;