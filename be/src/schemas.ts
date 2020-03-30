export const OrderSchema = {
  $schema: "http://json-schema.org/draft-07/schema#",
  definitions: {
    NewOrder: {
      additionalProperties: false,
      properties: {
        deliveryCost: {
          type: "number"
        },
        minimumOrderValue: {
          type: "number"
        },
        end: {
          description: "Enables basic storage and retrieval of dates and times.",
          format: "date-time",
          type: "string"
        },
        placeName: {
          type: "string"
        },
        placeUrl: {
          type: "string"
        },
        placeMetadata: {
          type: "object"
        }
      },
      type: "object"
    },
    Order: {
      additionalProperties: false,
      properties: {
        _id: {
          type: "string"
        },
        deliveryCost: {
          type: "number"
        },
        minimumOrderValue: {
          type: "number"
        },
        end: {
          description: "Enables basic storage and retrieval of dates and times.",
          format: "date-time",
          type: "string"
        },
        initiatorUserId: {
          type: "string"
        },
        masterUserId: {
          type: "string"
        },
        placeName: {
          type: "string"
        },
        placeUrl: {
          type: "string"
        },
        start: {
          description: "Enables basic storage and retrieval of dates and times.",
          format: "date-time",
          type: "string"
        },
        status: {
          type: "string"
        },
        userOrders: {
          items: {
            $ref: "#/definitions/UserOrder"
          },
          type: "array"
        },
        placeMetadata: {
          type: "object"
        }
      },
      type: "object"
    },
    OrderStatus: {
      enum: ["CANCELED", "DELIVERED", "FINISHED", "ORDERED", "STARTED", "CLOSED"],
      type: "string"
    },
    UpdateOrder: {
      additionalProperties: false,
      properties: {
        deliveryCost: {
          type: "number"
        },
        minimumOrderValue: {
          type: "number"
        },
        end: {
          description: "Enables basic storage and retrieval of dates and times.",
          format: "date-time",
          type: "string"
        },
        start: {
          description: "Enables basic storage and retrieval of dates and times.",
          format: "date-time",
          type: "string"
        },
        masterUserId: {
          type: "string"
        },
        placeName: {
          type: "string"
        },
        placeUrl: {
          type: "string"
        },
        status: {
          type: "string"
        },
        placeMetadata: {
          type: "object"
        }
      },
      type: "object"
    },
    UserOrder: {
      additionalProperties: false,
      properties: {
        comment: {
          type: "string"
        },
        item: {
          type: "string"
        },
        price: {
          type: "number"
        }
      },
      type: "object",
      required: ["item", "price"]
    }
  }
};
