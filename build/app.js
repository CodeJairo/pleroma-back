"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = void 0;
const config_1 = __importDefault(require("./config/config"));
const express_1 = __importDefault(require("express"));
const contract_routes_1 = require("./routes/contract.routes");
const createApp = () => {
  const app = (0, express_1.default)();
  app.use(express_1.default.json());
  app.disable("x-powered-by");
  app.use("/contract", (0, contract_routes_1.createContractRouter)());
  app.listen(config_1.default.port, () => {
    console.log(
      `Server is running on http://localhost:${config_1.default.port}`
    );
  });
};
exports.createApp = createApp;
