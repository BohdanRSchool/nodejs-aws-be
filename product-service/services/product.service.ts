import { Product } from '../models';
import productList from '../data/productList.json';

export const getProducts = async (): Promise<Array<Product>> => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(productList);
    }, 200);
  })
}

export const getProductById = async (productId: string): Promise<Product> => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(productList.find(product => product.id === productId));
    }, 200);
  })
}
