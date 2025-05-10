"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const env_var_1 = __importDefault(require("env-var"));
dotenv_1.default.config();
const config = {
  port: env_var_1.default.get("PORT").default(3000).asPortNumber(),
};
exports.default = config;
