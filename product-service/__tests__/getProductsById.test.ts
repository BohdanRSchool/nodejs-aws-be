import { getProductsById } from '../handler';
import * as ProductService from '../services/product.service';
import { Product } from '../models';

const spyProduct = jest.spyOn(ProductService, 'getProductById')

afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
});

describe('getProductsById', () => {
    test('it should return the product with statusCode 200', async () => {
        const event = {
            pathParameters: {
                productId: '7567ec4b-b10c-48c5-9345-fc73c48a80aa',
            },
        } as any;
        const mockResponse: Product =
        {
            "count": 4,
            "description": "Short Product Description1",
            "id": "7567ec4b-b10c-48c5-9345-fc73c48a80aa",
            "price": 2.4,
            "title": "ProductOne",
            "url": "https://test"
        };
        spyProduct.mockResolvedValue(mockResponse);

        const data = await getProductsById(event);
        expect(data.statusCode).toBe(200);
        expect(JSON.parse(data.body)).toEqual(mockResponse);
    });
});
