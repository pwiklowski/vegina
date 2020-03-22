import dotenv from "dotenv";
import express = require("express");
import * as mongo from "mongodb";
import { Order, OrderStatus, NewOrder, UpdateOrder, UserOrder, UserMetaData } from "./models";
import { OrderSchema } from "./schemas";
const { Validator, ValidationError } = require("express-json-validator-middleware");

const passport = require("passport");
const BearerStrategy = require("passport-http-bearer");

dotenv.config();

const { OAuth2Client } = require("google-auth-library");
const oAuth2Client = new OAuth2Client(process.env.CLIENT_ID);

const app: express.Application = express();

const validator = new Validator({ allErrors: true });

app.use(passport.initialize());
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
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

const createUserMetaData = (user: any): UserMetaData => {
  return {
    email: user.email,
    sub: user.sub,
    name: user.name,
    picture: user.picture
  };
};

(async () => {
  const client: mongo.MongoClient = await mongo.connect("mongodb://127.0.0.1:27017", {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  const db = client.db("wege");
  const orders = db.collection("orders");
  const users = db.collection("users");

  passport.use(
    new BearerStrategy(async (token: string, done: Function) => {
      try {
        const ticket = await oAuth2Client.verifyIdToken({ idToken: token, audience: process.env.CLIENT_ID });
        const payload = ticket.getPayload();

        users.updateOne({ sub: payload.sub }, { $set: payload }, { upsert: true });

        return done(null, payload, { scope: "all" });
      } catch (err) {
        return done(null, null, { scope: "all" });
      }
    })
  );

  app.get("/orders", passport.authenticate("bearer", { session: false }), async (req: express.Request, res: express.Response) => {
    const allOrders = await orders.find({}).toArray();
    res.json(allOrders);
  });

  app.post(
    "/orders",
    passport.authenticate("bearer", { session: false }),
    validator.validate({ body: OrderSchema.definitions.NewOrder }),
    async (req: express.Request, res: express.Response) => {
      const newOrder: NewOrder = req.body;
      const userId = req.user.sub;

      const order: Order = {
        ...newOrder,
        start: new Date(),
        status: OrderStatus.STARTED,
        masterUserId: userId,
        initiatorUserId: userId,
        master: createUserMetaData(req.user),
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

  app.get("/orders/:orderId", passport.authenticate("bearer", { session: false }), async (req: express.Request, res: express.Response) => {
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
    passport.authenticate("bearer", { session: false }),
    validator.validate({ body: OrderSchema.definitions.UpdateOrder }),
    async (req: express.Request, res: express.Response) => {
      const orderId = req.params.orderId;
      let order = (await orders.findOne({ _id: new mongo.ObjectID(orderId) })) as Order;
      if (order) {
        if (order.masterUserId !== req.user.sub) {
          return res.sendStatus(403);
        }

        const orderUpdate: UpdateOrder = req.body;
        order = { ...order, ...orderUpdate };
        await orders.replaceOne({ _id: new mongo.ObjectID(orderId) }, order);
        res.json(order);
      } else {
        res.sendStatus(400);
      }
    }
  );

  app.post(
    "/orders/:orderId",
    passport.authenticate("bearer", { session: false }),
    validator.validate({ body: OrderSchema.definitions.UserOrder }),
    async (req: express.Request, res: express.Response) => {
      const orderId = req.params.orderId;

      let order = (await orders.findOne({ _id: new mongo.ObjectID(orderId) })) as Order;
      if (order) {
        const userOrder: UserOrder = req.body;
        userOrder._id = new mongo.ObjectID().toHexString();
        userOrder.timestamp = new Date();
        userOrder.userId = req.user.sub;
        userOrder.user = createUserMetaData(req.user);
        userOrder.settled = false;

        order.userOrders.push(userOrder);

        await orders.replaceOne({ _id: new mongo.ObjectID(orderId) }, order);
        res.sendStatus(204);
      } else {
        res.sendStatus(400);
      }
    }
  );

  app.delete(
    "/orders/:orderId",
    passport.authenticate("bearer", { session: false }),
    async (req: express.Request, res: express.Response) => {
      const orderId = req.params.orderId;
      await orders.deleteOne({ _id: new mongo.ObjectID(orderId) });
      res.sendStatus(204);
    }
  );

  app.delete(
    "/orders/:orderId/:userOrderId",
    passport.authenticate("bearer", { session: false }),
    async (req: express.Request, res: express.Response) => {
      const orderId = req.params.orderId;
      const userOrderId = req.params.userOrderId;

      let order = (await orders.findOne({ _id: new mongo.ObjectID(orderId) })) as Order;
      if (order) {
        const userOrderIndex = order.userOrders.findIndex((userOrder: UserOrder) => userOrder._id === userOrderId);
        console.log(userOrderIndex);
        if (userOrderIndex < 0) {
          res.sendStatus(400);
          return;
        }

        if (order.userOrders[userOrderIndex].userId !== req.user.sub) {
          res.sendStatus(403);
          return;
        }

        order.userOrders = order.userOrders.filter((userOrder: UserOrder) => userOrder._id !== userOrderId);

        console.log(order);

        await orders.replaceOne({ _id: new mongo.ObjectID(orderId) }, order);
        res.sendStatus(204);
      } else {
        res.sendStatus(400);
      }
    }
  );

  app.patch(
    "/orders/:orderId/:userOrderId",
    passport.authenticate("bearer", { session: false }),
    async (req: express.Request, res: express.Response) => {
      const orderId = req.params.orderId;
      const userOrderId = req.params.userOrderId;

      let order = (await orders.findOne({ _id: new mongo.ObjectID(orderId) })) as Order;
      if (order) {
        const userOrderIndex = order.userOrders.findIndex((userOrder: UserOrder) => userOrder._id === userOrderId);
        console.log(userOrderIndex);
        if (userOrderIndex < 0) {
          res.sendStatus(400);
          return;
        }

        if (order.userOrders[userOrderIndex].userId !== req.user.sub) {
          res.sendStatus(403);
          return;
        }

        const userOrder: UserOrder = req.body;
        userOrder._id = new mongo.ObjectID().toHexString();
        userOrder.timestamp = new Date();
        userOrder.userId = req.user.sub;
        userOrder.user = createUserMetaData(req.user);
        userOrder.settled = false;

        order.userOrders[userOrderIndex] = userOrder;

        await orders.replaceOne({ _id: new mongo.ObjectID(orderId) }, order);
        res.sendStatus(204);
      } else {
        res.sendStatus(400);
      }
    }
  );

  app.use(function(err: any, req: any, res: any, next: any) {
    if (err instanceof ValidationError) {
      res.statusCode = 422;
      res.json(err);
      next();
    } else {
      next(err); // pass error on if not a validation error
    }
  });

  app.listen(8080);
})();
