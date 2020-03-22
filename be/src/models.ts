export interface Order {
  _id?: string;
  start: Date;
  end: Date;
  placeName: string;
  placeUrl: string;
  deliveryCost: number;
  masterUserId: string;
  initiatorUserId: string;
  userOrders: UserOrder[];
  status: string;
}

export interface NewOrder {
  start?: Date;
  end: Date;
  placeName: string;
  placeUrl: string;
  deliveryCost: number;
}

export interface UpdateOrder {
  end?: Date;
  placeName?: string;
  placeUrl?: string;
  deliveryCost?: number;
  masterUserId?: string;
  status?: string;
}

export interface UserOrder {
  _id?: string;
  userId?: string;
  timestamp?: Date;
  item: string;
  price: number;
  comment?: string;
  settled?: boolean;
}

export enum OrderStatus {
  STARTED = "STARTED",
  FINISHED = "FINISHED",
  ORDERED = "ORDERED",
  DELIVERED = "DELIVERED",
  CANCELED = "CANCELED"
}
