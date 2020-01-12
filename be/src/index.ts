import express = require("express");
import * as mongo from "mongodb";
import { Order, OrderStatus, NewOrder, UpdateOrder } from "./models";
import { OrderSchema } from "./schemas";
const { Validator, ValidationError } = require("express-json-validator-middleware");

const app: express.Application = express();

const validator = new Validator({ allErrors: true });

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
    limit: "100mb",
    parameterLimit: 1000000
  })
);

app.use(function(err: any, req: any, res: any, next: any) {
  if (err instanceof ValidationError) {
    res.status(400).send("invalid");
    next();
  } else next(err); // pass error on if not a validation error
});

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

(async () => {
  const client: mongo.MongoClient = await mongo.connect("mongodb://127.0.0.1:27017", {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  const db = client.db("wege");
  const orders = db.collection("orders");

  app.get("/", (req: express.Request, res: express.Response) => {
    res.send("hi");
  });

  app.get("/orders", async (req: express.Request, res: express.Response) => {
    const allOrders = await orders.find({}).toArray();
    res.json(allOrders);
  });

  app.post(
    "/orders",
    validator.validate({ body: OrderSchema.definitions.NewOrder }),
    async (req: express.Request, res: express.Response) => {
      const newOrder: NewOrder = req.body;

      const order: Order = {
        ...newOrder,
        start: new Date(),
        status: OrderStatus.STARTED,
        masterUserId: null,

        initiatorUserId: "MyUserId", //TODO put here correct valu
        userOrders: []
      };

      const response = await orders.insertOne(order);
      if (response.result.ok === 1) {
        res.json(response.ops[0]);
        return;
      }
      res.statusCode = 500;
      res.json(null);
    }
  );

  app.get("/orders/:orderId", async (req: express.Request, res: express.Response) => {
    const orderId = req.params.orderId;
    const order = (await orders.findOne({ _id: new mongo.ObjectID(orderId) })) as Order;
    if (order) {
      res.json(order);
    } else {
      res.sendStatus(404);
    }
  });

  app.patch(
    "/orders/:orderId",
    validator.validate({ body: OrderSchema.definitions.UpdateOrder }),
    async (req: express.Request, res: express.Response) => {
      const orderId = req.params.orderId;
      let order = (await orders.findOne({ _id: new mongo.ObjectID(orderId) })) as Order;
      if (order) {
        const orderUpdate: UpdateOrder = req.body;
        order = { ...order, ...orderUpdate };
        res.json(order);
      } else {
        res.sendStatus(400);
      }
    }
  );

  app.delete("/orders/:orderId", async (req: express.Request, res: express.Response) => {
    const orderId = req.params.orderId;
    await orders.deleteOne({ _id: new mongo.ObjectID(orderId) });
    res.sendStatus(204);
  });

  app.listen(8080);
})();
