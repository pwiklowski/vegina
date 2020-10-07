export interface Order {
  _id?: string;
  start: Date;
  end: Date;
  placeName: string;
  placeUrl: string;
  deliveryCost: number;
  masterUserId: string;
  master: UserMetaData;
  initiatorUserId: string;
  userOrders: UserOrder[];
  status: string;
  placeMetadata?: any;
  minimumOrderValue: number;
}

export interface NewOrder {
  start?: Date;
  end: Date;
  placeName: string;
  placeUrl: string;
  deliveryCost: number;
  placeMetadata?: Object;
  minimumOrderValue: number;
}

export interface UpdateOrder {
  end?: Date;
  placeName?: string;
  placeUrl?: string;
  deliveryCost?: number;
  masterUserId?: string;
  status?: string;
  placeMetadata?: Object;
  minimumOrderValue: number;
}

export interface UserOrder {
  _id?: string;
  userId?: string;
  user?: UserMetaData;
  timestamp?: Date;
  item: string;
  price: number;
  comment?: string;
  settled?: boolean;
  options: Array<any>;
}

export enum OrderStatus {
  STARTED = "STARTED",
  FINISHED = "FINISHED",
  ORDERED = "ORDERED",
  DELIVERED = "DELIVERED",
  CANCELED = "CANCELED",
  CLOSED = "CLOSED",
}

export interface UserMetaData {
  sub: string;
  email: string;
  name: string;
  picture: string;
}
