import express = require("express");

const { Takeaway, TakeawayConfig } = require("takeaway");

const app: express.Application = express();
const config = new TakeawayConfig({
  language: "pl",
  url: "https://pl-cdn.citymeal.com/android/android.php"
});

(async () => {
  const takeaway = new Takeaway(config);
  const country = await takeaway.getCountryById("PL");

  app.use(express.json());
  app.use(
    express.urlencoded({
      extended: true,
      limit: "100mb",
      parameterLimit: 1000000
    })
  );

  app.get(
    "/restaurants",
    async (req: express.Request, res: express.Response) => {
      const { code, latitude, longitude } = req.query;

      try {
        const restaurants = await country.getRestaurants(
          code,
          latitude,
          longitude
        );
        const processedList = restaurants.map((restaurant: Restaurant) => {
          const {
            id,
            name,
            logoUrl,
            deliveryCosts,
            grade,
            ratingCount
          } = restaurant.data;
          return {
            id,
            name,
            logoUrl,
            deliveryCosts,
            grade,
            ratingCount
          };
        });

        res.json(processedList);
      } catch (err) {
        console.error(err);
        res.json({ err });
      }
    }
  );

  app.get(
    "/restaurant/:restaurantId",
    async (req: express.Request, res: express.Response) => {
      const { code, latitude, longitude } = req.query;
      const restaurantId = req.params.restaurantId;

      const menu = await takeaway.getClient().getMenuCard({
        restaurantId,
        postalCode: code,
        latitude,
        longitude
      });
      res.json(menu);
    }
  );

  app.listen(8001);
})();
