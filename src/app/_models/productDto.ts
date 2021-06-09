import { Category, Condition, Demand, Trademark, Vendor } from "./productDetailDto";
import { ProductImage } from "./productImageDto";

export interface Product {
  id: number;
  name: string;
  categoryId: number;
  category: Category
  vendorId: number;
  vendor: Vendor
  trademarkId: number;
  trademark: Trademark;
  demandId: number;
  demand: Demand;
  conditionId: number;
  condition: Condition;
  cpu: string;
  screen: string;
  ram: string;
  gpu: string;
  storage: string;
  pin: string;
  connection: string;
  weight: string;
  os: string;
  color: string;
  warranty: string;
  price: number;
  unitsInStock: number;
  unitsOnOrder: number;
  description: string;
  discontinued: boolean;
  productImages: ProductImage[]
}
