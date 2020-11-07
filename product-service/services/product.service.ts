import { Client } from "pg";

import { Product } from '../models';

const { PG_HOST, PG_PORT, PG_DATABASE, PG_USERNAME, PG_PASSWORD } = process.env
const dbOption = {
  user: PG_USERNAME,
  host: PG_HOST,
  database: PG_DATABASE,
  password: PG_PASSWORD,
  port: PG_PORT,
  connectionTimeoutMillis: 5000
}

export const getProducts = async (): Promise<Array<Product>> => {
  const client = new Client(dbOption);
  await client.connect();
  let rows;
  try {
    ({ rows } = await client.query('SELECT p.id, title, description, url, price, count FROM products p INNER JOIN stocks s ON p.id = s.product_id'));
  } catch (error) {
    throw Error(error.stack)
  } finally {
    client.end();
  }
  return rows;
}

export const getProductById = async (productId: string): Promise<Product> => {
  const client = new Client(dbOption);
  await client.connect();
  let rows;
  try {
    ({ rows } = await client.query('SELECT p.id, title, description, url, price, count FROM products p INNER JOIN stocks s ON p.id = s.product_id WHERE p.id=$1', [productId]));
  } catch (error) {
    throw Error(error.stack)
  } finally {
    client.end();
  }
  return rows[0];
}

export const createProduct = async (product: Product): Promise<void> => {
  const client = new Client(dbOption);
  const { title, description, url, price, count } = product;
  await client.connect();
  try {
    await client.query('BEGIN')
    const inesrtProductQuery = 'INSERT INTO products (title, description, url, price) VALUES($1, $2, $3, $4) RETURNING id';
    const res = await client.query(inesrtProductQuery, [title, description, url, price]);
    const insertStockQuery = 'INSERT INTO stocks (product_id, count) VALUES($1, $2)';
    await client.query(insertStockQuery, [res.rows[0].id, count]);
    await client.query('COMMIT')
  } catch (e) {
    await client.query('ROLLBACK')
    console.log('ROLLBACK');
    throw Error(e.stack)
  } finally {
    client.end()
  }
}
