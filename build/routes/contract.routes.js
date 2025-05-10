"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createContractRouter = void 0;
const express_1 = require("express");
const createContractRouter = () => {
  const contractRouter = (0, express_1.Router)();
  contractRouter.get("/home", (_, res) => {
    res.send("Hello from contract router");
  });
  return contractRouter;
};
exports.createContractRouter = createContractRouter;
