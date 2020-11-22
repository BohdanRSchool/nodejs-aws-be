import 'source-map-support/register';

import { catalogBatchProcess } from './handlers/catalogBatchProcess';
import { createProducts } from './handlers/createProducts';
import { getProductsById } from './handlers/getProductsById';
import { getProductsList } from './handlers/getProductsList';

export {
  catalogBatchProcess,
  createProducts,
  getProductsById,
  getProductsList,
}
