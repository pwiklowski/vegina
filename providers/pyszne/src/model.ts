export interface Restaurant {
  id: string;
  name: string;
  logoUrl: string;
  deliveryCosts: DeliveryCost;
  grade: number;
  ratingCount: number;
}

export interface DeliveryCost {
  costs: Costs;
  minimumAmount: number;
}

export interface Costs {
  from: number;
  to: number;
  costs: number;
}
