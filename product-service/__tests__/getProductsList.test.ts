import { getProductsList } from '../handler';
import * as ProductService from '../services/product.service';
import { Product} from '../models';

const mockResponse: Array<Product>= [
  {
    "count": 4,
    "description": "Short Product Description1",
    "id": "7567ec4b-b10c-48c5-9345-fc73c48a80aa",
    "price": 2.4,
    "title": "ProductOne",
    "url": "https://test"
  },
  {
    "count": 6,
    "description": "Short Product Description3",
    "id": "7567ec4b-b10c-48c5-9345-fc73c48a80a0",
    "price": 10,
    "title": "ProductNew",
    "url": "https://test"
  }
];
const spyProduct = jest.spyOn(ProductService, 'getProducts')

afterEach(() => {
  jest.clearAllMocks();
  jest.resetAllMocks();
});

describe('getProductsList', () => {
  test('it should return the product list with statusCode 200', async () => {
    spyProduct.mockResolvedValue(mockResponse);

    const data = await getProductsList();

    expect(data.statusCode).toBe(200);
    expect(Array.isArray(JSON.parse(data.body))).toBe(true);
    expect(JSON.parse(data.body).length).toBeGreaterThan(0);
  });
});
