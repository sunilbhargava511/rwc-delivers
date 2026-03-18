// All prices in cents
export const DELIVERY_FEE = 450; // $4.50
export const MIN_ORDER_AMOUNT = 1500; // $15.00
export const TIP_DEFAULTS = [300, 500, 700] as const; // $3, $5, $7

// Redwood City center coordinates (Broadway & Main)
export const RWC_CENTER = {
  lat: 37.4852,
  lng: -122.2364,
} as const;

// Approximate delivery zone polygon (downtown RWC ~3 mile radius)
export const DELIVERY_ZONE_POLYGON: [number, number][] = [
  [-122.2800, 37.5100], // NW
  [-122.1950, 37.5100], // NE
  [-122.1950, 37.4550], // SE
  [-122.2800, 37.4550], // SW
  [-122.2800, 37.5100], // close polygon
];

export const SUBSCRIPTION_PRICE = 39900; // $399/month

export const ORDER_NUMBER_PREFIX = "RWC";

export const STRIPE_FEE_PERCENT = 2.9;
export const STRIPE_FEE_FIXED = 30; // $0.30
