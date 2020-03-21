import dotenv from 'dotenv';
import express = require("express");
import * as mongo from "mongodb";
import { Order, OrderStatus, NewOrder, UpdateOrder } from "./models";
import { OrderSchema } from "./schemas";
const { Validator, ValidationError } = require("express-json-validator-middleware");

const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
const BearerStrategy = require("passport-http-bearer");


dotenv.config();

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

app.use(function (req, res, next) {
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
  const users = db.collection("users");

  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: process.env.CALLBACK_URL
      },
      async (token: string, tokenSecret: string, profile: any, done: Function) => {
        await users.insertOne({ profile, token });
        done(null, { googleId: profile.id });
      }
    )
  );

  passport.use(
    new BearerStrategy(async (token: string, done: Function) => {
      const user = await users.findOne({ token })
      return done(null, user, { scope: "all" });
    })
  );

  app.get("/profile",
    passport.authenticate("bearer", { session: false }),
    (req: express.Request, res: express.Response) => {
      res.json(req.user.profile);
    }
  );

  app.get("/auth/google",
    passport.authenticate("google", {
      session: false,
      scope: "https://www.googleapis.com/auth/userinfo.profile"
    })
  );

  app.get("/auth/google/callback",
    passport.authenticate("google", {
      session: false,
      failureRedirect: "/login"
    }),
    (req, res) => {
      res.redirect("/");
    }
  );

  app.get("/orders",
    passport.authenticate("bearer", { session: false }),
    async (req: express.Request, res: express.Response) => {
      const allOrders = await orders.find({}).toArray();
      res.json(allOrders);
    }
  );

  app.post(
    "/orders",
    passport.authenticate("bearer", { session: false }),
    validator.validate({ body: OrderSchema.definitions.NewOrder }),
    async (req: express.Request, res: express.Response) => {
      const newOrder: NewOrder = req.body;
      const userId = req.user.profile.id;

      const order: Order = {
        ...newOrder,
        start: new Date(),
        status: OrderStatus.STARTED,
        masterUserId: userId,
        initiatorUserId: userId,
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

  app.get("/orders/:orderId",
    passport.authenticate("bearer", { session: false }),
    async (req: express.Request, res: express.Response) => {
      const orderId = req.params.orderId;
      const order = (await orders.findOne({ _id: new mongo.ObjectID(orderId) })) as Order;
      if (order) {
        res.json(order);
      } else {
        res.sendStatus(404);
      }
    }
  );

  app.patch(
    "/orders/:orderId",
    passport.authenticate("bearer", { session: false }),
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

  app.delete("/orders/:orderId",
    passport.authenticate("bearer", { session: false }),
    async (req: express.Request, res: express.Response) => {
      const orderId = req.params.orderId;
      await orders.deleteOne({ _id: new mongo.ObjectID(orderId) });
      res.sendStatus(204);
    }
  );

  app.use(function (err: any, req: any, res: any, next: any) {
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
