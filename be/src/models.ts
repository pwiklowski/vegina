export interface Order {
  _id?: string;
  start?: Date;
  end: Date;
  placeName: string;
  placeUrl: string;
  deliveryCost: number;
  masterUserId?: string;
  initiatorUserId?: string;
  userOrders?: UserOrder[];
  status?: string;
}

export const OrderSchema = {
  $schema: "http://json-schema.org/draft-07/schema#",
  definitions: {
    Order: {
      additionalProperties: false,
      properties: {
        deliveryCost: {
          type: "number"
        },
        end: {
          additionalProperties: false,
          type: "object"
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
          additionalProperties: false,
          type: "object"
        },
        status: {
          type: "string"
        },
        userOrders: {
          items: {
            $ref: "#/definitions/UserOrder"
          },
          type: "array"
        }
      },
      required: [
        "end",
        "placeName",
        "placeUrl",
        "deliveryCost",
        "initiatorUserId"
      ],
      type: "object"
    },
    OrderStatus: {
      enum: [0, 1, 2, 3, 4],
      type: "number"
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
        },
        timestamp: {
          additionalProperties: false,
          type: "object"
        }
      },
      required: ["timestamp", "item", "price", "comment"],
      type: "object"
    }
  }
};

export interface UserOrder {
  timestamp: Date;
  item: string;
  price: number;
  comment: string;
  settled: boolean;
}

export enum OrderStatus {
  STARTED = "STARTED",
  FINISHED = "FINISHED",
  ORDERED = "ORDERED",
  DELIVERED = "DELIVERED",
  CANCELED = "CANCELED"
}
