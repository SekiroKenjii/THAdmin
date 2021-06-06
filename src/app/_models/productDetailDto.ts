export interface Category {
  id: number;
  name: string;
  description: string;
}
export interface Condition {
  id: number;
  name: string;
  description: string;
}
export interface Demand {
  id: number;
  name: string;
}
export interface Trademark {
  id: number;
  name: string;
  description: string;
  status: number;
  imageUrl: string;
  publicId: string;
}
export interface Vendor {
  id: number;
  name: string;
  contactName: string;
  contactTitle: string;
  address: string;
  city: string;
  country: string;
  phoneNumber: string;
  homePage: string;
  status: number;
}
export interface ProductDetailsViewModel {
  categories: Category[];
  vendors: Vendor[];
  trademarks: Trademark[];
  demands: Demand[];
  conditions: Condition[];
}
