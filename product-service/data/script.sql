create extension if not exists "uuid-ossp";

create table products(id uuid primary key default uuid_generate_v4(), title text not null, description text, url text, price numeric CHECK(price > 0));

create table stocks(id uuid primary key default uuid_generate_v4(), product_id uuid, count integer CHECK(count > 0), foreign key ("product_id") references "products" ("id"));

with product as (
insert into products(title, description, url, price)
	values ('L.O.L. Surprise! O.M.G. Remix Kitty K Fashion Doll', 'Unbox L.O.L. Surprise! O.M.G. Remix fashion doll Kitty K with 25 surprises.', 'https://image.smythstoys.com/original/desktop/189115.jpg', 39.99) returning id )
insert into	stocks(product_id, count) values((select id from product), 4);

with product as (
insert into products(title, description, url, price)
	values ('L.O.L. Surprise! O.M.G. Remix Lonestar Fashion Doll', 'Unbox L.O.L. Surprise! O.M.G. Remix fashion doll Kitty K with 25 surprises.', 'https://image.smythstoys.com/original/desktop/189114.jpg', 39.99) returning id )
insert into	stocks(product_id, count) values((select id from product), 6);

with product as (
insert into products(title, description, url, price)
	values ('L.O.L. Surprise! O.M.G. Remix Pop B.B. Fashion Doll', 'Unbox L.O.L. Surprise! O.M.G. Remix fashion doll Kitty K with 25 surprises.', 'https://image.smythstoys.com/original/desktop/189116.jpg', 39.99) returning id )
insert into	stocks(product_id, count) values((select id from product), 7);

with product as (
insert into products(title, description, url, price)
	values ('L.O.L. Surprise! O.M.G. Remix 2020 Collector Edition Jukebox B.B', 'O.M.G! The Original Queen of Rock is ready to join with her crew to take back the stage and steal the show', 'https://image.smythstoys.com/original/desktop/189118.jpg', 39.99) returning id )
insert into	stocks(product_id, count) values((select id from product), 12);

with product as (
insert into products(title, description, url, price)
	values ('L.O.L. Surprise! O.M.G. Remix Honeylicious Fashion Doll', 'O.M.G. we sisters are ready to take the stage, but everything on our So Extra Tour got remixed – from our music to our fashions', 'https://image.smythstoys.com/original/desktop/189117.jpg', 39.99) returning id )
insert into	stocks(product_id, count) values((select id from product), 7);

with product as (
insert into products(title, description, url, price)
	values ('L.O.L. Surprise! Remix Hair Flip Doll Assortment', '12 dolls to collect in this L.O.L. Surprise! Remix Hair Flip Doll Assortment.', 'https://image.smythstoys.com/original/desktop/189112.jpg', 14.99) returning id )
insert into	stocks(product_id, count) values((select id from product), 8);

with product as (
insert into products(title, description, url, price)
	values ('L.O.L. Surprise! Remix Pets Assortment', '12 L.O.L. Surprise! Pets to collect in this L.O.L. Surprise! Remix Pets Assortment. L.O.L. Surprise!', 'https://image.smythstoys.com/original/desktop/189113.jpg', 11.99) returning id )
insert into	stocks(product_id, count) values((select id from product), 2);
with product as (

insert into products(title, description, url, price)
	values ('L.O.L. Surprise! O.M.G. Winter Chill Icy Gurl & Brrr B.B. Doll with 25 Surprises', 'O.M.G! We sisters are ready to slay the ultimate winter vacay.', 'https://image.smythstoys.com/original/desktop/189982.jpg', 39.99) returning id )
insert into	stocks(product_id, count) values((select id from product), 3);
