import express = require("express");
import * as mongo from "mongodb";
import { Order, OrderSchema, OrderStatus } from "./models";
import { Validator } from "jsonschema";

const app: express.Application = express();
const validator = new Validator();

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
    limit: "100mb",
    parameterLimit: 1000000
  })
);

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

(async () => {
  const client: mongo.MongoClient = await mongo.connect(
    "mongodb://127.0.0.1:27017",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  );
  const db = client.db("wege");
  const orders = db.collection("orders");

  app.get("/", (req: express.Request, res: express.Response) => {
    res.send("hi");
  });

  app.get("/orders", async (req: express.Request, res: express.Response) => {
    const allOrders = await orders.find({}).toArray();
    res.json(allOrders);
  });

  app.post("/orders", async (req: express.Request, res: express.Response) => {
    const validationResponse = validator.validate(req.body, OrderSchema);
    if (validationResponse.valid) {
      const order: Order = req.body;
      order.start = new Date();
      order.status = OrderStatus.STARTED;
      order.masterUserId = null;
      order.initiatorUserId = "MyUserId"; //TODO put here correct value
      order.userOrders = [];

      const response = await orders.insertOne(order);
      if (response.result.ok === 1) {
        res.json(response.ops[0]);
        return;
      }
      res.statusCode = 500;
      res.json(null);
    } else {
      res.statusCode = 422;
      res.json({ error: validationResponse.errors.join(",") });
    }
  });

  app.get(
    "/orders/:orderId",
    async (req: express.Request, res: express.Response) => {
      const orderId = req.params.orderId;
      const order = (await orders.findOne({
        _id: new mongo.ObjectID(orderId)
      })) as Order;
      if (order) {
        res.json(order);
      } else {
        res.sendStatus(404);
      }
    }
  );

  app.delete(
    "/orders/:orderId",
    async (req: express.Request, res: express.Response) => {
      const orderId = req.params.orderId;
      await orders.deleteOne({
        _id: new mongo.ObjectID(orderId)
      });
      res.sendStatus(204);
    }
  );

  app.listen(8080);
})();
