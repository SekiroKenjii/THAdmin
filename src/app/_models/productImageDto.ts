export interface ProductImage {
  id: number;
  productId: number;
  imageUrl: string;
  publicId: string;
  caption: string;
  sortOrder: number;
}
export interface EditProductImage {
  productId: number,
  productName: string,
  productImages: ProductImage[]
}
export interface AddProductImage {
  productId: number,
  images: File[]
}
export interface EditProductImageDto {
  sortOrder: number,
  image: File
}
