import dotenv from "dotenv";
import env from "env-var";

dotenv.config();

const config = {
  port: env.get("PORT").default(3000).asPortNumber(),
};

export default config;
