import express = require("express");

const app: express.Application = express();

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
    limit: "100mb",
    parameterLimit: 1000000
  })
);

app.get("/restaurants", async (req: express.Request, res: express.Response) => {
  res.json({});
});

app.listen(8001);
