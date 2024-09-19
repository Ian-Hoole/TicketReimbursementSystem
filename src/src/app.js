const express = require('express');
const { logger }  = require("./util/logger.js");
const userRouter = require("./controller/userController.js");

const app = express();

const PORT = 3000;

app.use(express.json());

app.use((req, res, next) => {
    logger.info(`Incoming ${req.method} : ${req.url}`);
    next();
});

app.use("/users", userRouter);

app.listen(PORT, () => {
    console.log(`Server is listening on http://localhost:${PORT}`);
});