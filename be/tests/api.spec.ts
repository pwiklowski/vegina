import { Order } from "../src/models";
import * as Cypress from "cypress";

describe("Orders API Tests", function() {
  it("/orders returns JSON", () => {
    cy.request("/orders")
      .its("headers")
      .its("content-type")
      .should("include", "application/json");
  });

  it("/orders returns 200", () => {
    cy.request("/orders")
      .its("headers")
      .its("content-type")
      .should("include", "application/json");
  });

  it("should add order to database", () => {
    const endDate = new Date();

    const order: Order = {
      end: endDate,
      placeName: "placeName",
      placeUrl: "placeUrl",
      deliveryCost: 5.0
    };

    cy.request("POST", "/orders", order).then(response => {
      expect(response.status).to.eq(200);
      expect(response.body._id).to.be.not.undefined;
      expect(response.body.end).to.be.eq(endDate.toISOString());
      expect(response.body.placeName).to.be.eq(order.placeName);
      expect(response.body.placeUrl).to.be.eq(order.placeUrl);
      expect(response.body.deliveryCost).to.be.eq(order.deliveryCost);
      expect(response.body.start).to.be.not.undefined;
      expect(response.body.status).to.be.eq("STARTED");
      expect(response.body.masterUserId).to.be.eq(null);
      expect(response.body.initiatorUserId).to.be.eq("MyUserId");
      expect(response.body.userOrders.length).to.be.eq(0);

      const id = response.body._id;

      cy.request("/orders").then(response => {
        const order = response.body.filter((order: Order) => {
          return order._id === id;
        });

        expect(order.length).to.be.eq(1);
      });

      cy.request("/orders/" + id).then((response: Cypress.Response) => {
        expect(response.body).to.be.not.undefined;
        expect(response.body._id).to.be.eq(id);
      });

      cy.request("DELETE", "/orders/" + id).then(
        (response: Cypress.Response) => {
          expect(response.status).to.be.eq(204);
        }
      );

      cy.request({ url: "/orders/" + id, failOnStatusCode: false }).then(
        (response: Cypress.Response) => {
          expect(response.status).to.be.eq(404);
        }
      );

      cy.request("/orders").then(response => {
        const order = response.body.filter((order: Order) => {
          return order._id === id;
        });
        expect(order.length).to.be.eq(0);
      });
    });
  });
});
