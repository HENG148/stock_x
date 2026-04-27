--
-- PostgreSQL database dump
--

\restrict uDGmewY2aK0MurpOc6hk2Te5rbZOsY05Kq8ER49ml0K96tM3tIHDPMOgdE0vaOt

-- Dumped from database version 18.3
-- Dumped by pg_dump version 18.3

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: drizzle; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA drizzle;


ALTER SCHEMA drizzle OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: __drizzle_migrations; Type: TABLE; Schema: drizzle; Owner: postgres
--

CREATE TABLE drizzle.__drizzle_migrations (
    id integer NOT NULL,
    hash text NOT NULL,
    created_at bigint
);


ALTER TABLE drizzle.__drizzle_migrations OWNER TO postgres;

--
-- Name: __drizzle_migrations_id_seq; Type: SEQUENCE; Schema: drizzle; Owner: postgres
--

CREATE SEQUENCE drizzle.__drizzle_migrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE drizzle.__drizzle_migrations_id_seq OWNER TO postgres;

--
-- Name: __drizzle_migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: drizzle; Owner: postgres
--

ALTER SEQUENCE drizzle.__drizzle_migrations_id_seq OWNED BY drizzle.__drizzle_migrations.id;


--
-- Name: accounts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.accounts (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    type character varying(255) NOT NULL,
    provider character varying(255) NOT NULL,
    provider_account_id character varying(255) NOT NULL,
    refresh_token text,
    access_token text,
    expires_at integer,
    token_type character varying(255),
    scope character varying(255),
    id_token text,
    session_state character varying(255)
);


ALTER TABLE public.accounts OWNER TO postgres;

--
-- Name: bids; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.bids (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    product_id uuid NOT NULL,
    buyer_id uuid NOT NULL,
    bid_price numeric(10,2) NOT NULL,
    size character varying(20),
    is_active boolean DEFAULT true,
    expires_at timestamp without time zone,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.bids OWNER TO postgres;

--
-- Name: categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.categories (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying(100) NOT NULL,
    slug character varying(200) NOT NULL,
    image_url character varying(500),
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.categories OWNER TO postgres;

--
-- Name: listings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.listings (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    product_id uuid NOT NULL,
    seller_id uuid NOT NULL,
    ask_price numeric(10,2) NOT NULL,
    size character varying(20),
    is_active boolean DEFAULT true,
    expires_at timestamp without time zone,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.listings OWNER TO postgres;

--
-- Name: order_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.order_items (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    order_id uuid,
    product_id uuid,
    quantity integer NOT NULL,
    price numeric(10,2) NOT NULL,
    size character varying(20)
);


ALTER TABLE public.order_items OWNER TO postgres;

--
-- Name: orders; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.orders (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    total numeric(10,2) NOT NULL,
    status character varying(50) DEFAULT 'pending'::character varying,
    created_at timestamp without time zone DEFAULT now(),
    seller_id uuid
);


ALTER TABLE public.orders OWNER TO postgres;

--
-- Name: products; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.products (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying(200) NOT NULL,
    description text,
    price numeric(10,2) NOT NULL,
    stock integer DEFAULT 0,
    image_url character varying(500),
    category character varying(100),
    created_at timestamp without time zone DEFAULT now(),
    brand character varying(100),
    sku character varying(100),
    lowest_ask numeric(10,2),
    highest_bid numeric(10,2),
    last_sale_price numeric(10,2),
    category_id uuid,
    is_featured boolean DEFAULT false,
    featured_until timestamp without time zone,
    section character varying(50) DEFAULT 'all'::character varying,
    slug character varying(200)
);


ALTER TABLE public.products OWNER TO postgres;

--
-- Name: sessions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sessions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    session_token character varying(255) NOT NULL,
    user_id uuid NOT NULL,
    expires timestamp without time zone NOT NULL
);


ALTER TABLE public.sessions OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying(100),
    email character varying(255) NOT NULL,
    password character varying(255),
    role character varying(20) DEFAULT 'customer'::character varying,
    created_at timestamp without time zone DEFAULT now(),
    email_verified timestamp without time zone,
    image character varying(500)
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: watchlist; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.watchlist (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    product_id uuid NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.watchlist OWNER TO postgres;

--
-- Name: __drizzle_migrations id; Type: DEFAULT; Schema: drizzle; Owner: postgres
--

ALTER TABLE ONLY drizzle.__drizzle_migrations ALTER COLUMN id SET DEFAULT nextval('drizzle.__drizzle_migrations_id_seq'::regclass);


--
-- Data for Name: __drizzle_migrations; Type: TABLE DATA; Schema: drizzle; Owner: postgres
--

COPY drizzle.__drizzle_migrations (id, hash, created_at) FROM stdin;
2	1012feca10a414407a1bed30717178d079f8d9e75d53a11ed6b7f479b72305bc	1776366371287
3	a61341c2d78e2143cfd1ce0d6fdd2264981b799f281f2513cfc51071b364f6c1	1776371287942
\.


--
-- Data for Name: accounts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.accounts (id, user_id, type, provider, provider_account_id, refresh_token, access_token, expires_at, token_type, scope, id_token, session_state) FROM stdin;
\.


--
-- Data for Name: bids; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.bids (id, product_id, buyer_id, bid_price, size, is_active, expires_at, created_at) FROM stdin;
\.


--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.categories (id, name, slug, image_url, created_at) FROM stdin;
\.


--
-- Data for Name: listings; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.listings (id, product_id, seller_id, ask_price, size, is_active, expires_at, created_at) FROM stdin;
\.


--
-- Data for Name: order_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.order_items (id, order_id, product_id, quantity, price, size) FROM stdin;
\.


--
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.orders (id, user_id, total, status, created_at, seller_id) FROM stdin;
\.


--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.products (id, name, description, price, stock, image_url, category, created_at, brand, sku, lowest_ask, highest_bid, last_sale_price, category_id, is_featured, featured_until, section, slug) FROM stdin;
9b62ef8d-87b4-494e-b311-081cc713e8c6	Dunk low 11	\N	188.00	10	\N	Sneakers	2026-04-19 23:01:24.351064	Nike	5511-444	5000.00	122.00	1002.00	\N	t	\N	all	dunk-low-11
e6c12c25-c51a-40d3-acc8-8b5aad02b5ec	Nike Air Force 1	\N	120.00	3	\N	Sneakers	2026-04-19 21:46:42.150508	Nike	111111	500.00	\N	\N	\N	t	\N	all	nike-air-force-1
40da0363-6ea8-4b39-acae-52e743b68c41	Nike Dunk Low UNC ( 2021 )	\N	4000.00	3	https://images.stockx.com/images/Nike-Dunk-Low-UNC-2021-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90&dpr=2&trim=color&updated_at=1738193358	Sneakers	2026-04-19 23:13:47.018257	Nike	1122-000	1000.00	5000.00	15000.00	\N	t	\N	all	nike-dunk-low-unc-2021-
283a01b0-7af0-40f7-9d6d-fddf6d037941	Nike KD 15 Aunt Peal	\N	400.00	2	https://images.stockx.com/images/Nike-KD-15-Aunt-Pearl-Product.jpg?fit=fill&bg=FFFFFF&w=1200&h=857&q=60&dpr=1&trim=color&updated_at=1738193358	Sneakers	2026-04-20 03:49:12.549563	Nike	12	361.00	4000.00	600.00	\N	t	2026-05-03 20:49:12.51	all	nike-kd-15-aunt-peal
9f32c751-eea1-4138-be01-23bdcfdcb394	Nike GT Cut Cross Barely Grape	\N	1111.00	99	https://images.stockx.com/images/Nike-GT-Cut-Cross-Barely-Grape-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90&dpr=2&trim=color&updated_at=1738193358	Shoes	2026-04-20 03:57:25.806289	Nike	1122	1000.00	1231.00	2342.00	\N	t	2026-05-03 20:57:25.767	all	nike-gt-cut-cross-barely-grape
6e4ae6f0-c843-4801-a0d7-c89dfdbd70e7	Lebron	\N	2332.00	44	https://images.stockx.com/images/Nike-Dunk-Low-UNC-2021-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90&dpr=2&trim=color&updated_at=1738193358	Shoes	2026-04-20 04:03:20.390412	Nike	1213	123123.00	12111123.00	23123.00	\N	t	2026-05-03 21:03:20.349	all	lebron
8a380c10-0757-4426-8a19-5b47fe76b4c6	Curry	The Air Jordan 1 Retro High Virgil Abloh Archive Alaska continues the legacy of Virgil Abloh’s transformative work on the Air Jordan 1, pushing his deconstructed design language into a new, all-white direction. Dressed entirely in white, the sneaker emphasizes exposed construction, layered materials, and the industrial detailing that defined Abloh’s original Off-White collaboration from 2017.\r\n\r\nVirgil Abloh’s approach to the Jordan 1 fundamentally reshaped how sneakers could be interpreted, blending fashion, art, and product design into one cohesive vision. The "Alaska" concept builds on that foundation, stripping the color palette back to its purest form while allowing stitching, text elements, and paneling to take center stage. It feels more archival than flashy, aligning with Abloh’s broader philosophy of process and transparency.\r\n\r\nWhen the Air Jordan 1 Retro High Virgil Abloh Archive Alaska released, it retailed for $230 and dropped on April 3, 2026. As part of a continuing exploration of Virgil’s design legacy, this release reinforces the Air Jordan 1’s place at the intersection of fashion and sneaker culture.	123.00	11	https://images.stockx.com/images/Nike-Dunk-Low-UNC-2021-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90&dpr=2&trim=color&updated_at=1738193358	Shoes	2026-04-20 04:04:24.988224	Nike	55	234.00	4332.00	1223.00	\N	t	2026-05-03 21:04:24.951	all	curry
bf3cefe7-c88b-49ca-9614-194e18e48c93	Under Armour Curry Flow 10 	\N	111.00	3	https://images.stockx.com/images/Under-Armour-Curry-Flow-10-Girl-Dad-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90&dpr=2&trim=color&updated_at=1738193358	Shoes	2026-04-22 01:46:49.728728	Under Armour	1111	111.00	111.00	111.00	\N	t	2026-05-05 18:46:49.688	all	under-armour-curry-flow-10-
d59218ff-8416-43c5-98cb-829d5b498c9c	Curry 12	\N	111.00	222	https://images.stockx.com/images/Nike-Dunk-Low-UNC-2021-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90&dpr=2&trim=color&updated_at=1738193358	Apparel	2026-04-23 11:17:40.403544	Under Armour	121	111.00	111.00	111.00	\N	t	2026-05-07 04:17:40.398	all	curry-12
0d52ae79-c8aa-410a-a85c-ff6f7a93ec02	Under Armour Curry Flow 10 Girl Dad	\N	112.00	1	https://images.stockx.com/images/Under-Armour-Curry-Flow-10-Girl-Dad-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90&dpr=2&trim=color&updated_at=1738193358	Sneakers	2026-04-21 22:02:18.872982	Under Armour	11-22	74.00	1123.00	320.99	\N	t	2026-05-05 15:02:18.815	all	under-armour-curry-flow-10-girl-dad
\.


--
-- Data for Name: sessions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sessions (id, session_token, user_id, expires) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, name, email, password, role, created_at, email_verified, image) FROM stdin;
8e397177-6134-494c-99a5-915b3a7eb8c8	Rong Sokheng	bongbrosbongbros6@gmail.com	$2b$10$PE7293SI2636wWGYApeVf.j5j0e0uzBfvsOtOtI9oPhK13vckO0Pu	customer	2026-04-17 20:13:20.142991	\N	\N
8af8a71d-6969-491d-9af5-54a7074f4913	Rong	sfasdfas@gmail.com	$2b$10$ShJfL4kbWAk/3Dhct0/cKe4XSN/7UiFtf2PD5qHK9D9NwTLfYZwU6	customer	2026-04-17 21:01:21.303085	\N	\N
2ab07d83-74b5-4999-badd-07fcad371f08	Rong Sokheng	rongsokheng123@gmail.com	$2b$10$LFwibW1WzcJsZOQFLR5oXO1hO75AYj8p5eTeFLFE0.6eOxnt8QUyS	customer	2026-04-20 20:52:20.455918	\N	\N
3ed35f99-1ba4-4efb-b8b7-111ede9e825b	Try Dany	trydany123@gmail.com	$2b$10$tqq0dm98isgMglgUV.UGGe/jYc/sumfGFZ9zUZAw262/fAFlVpVqG	customer	2026-04-21 00:30:28.249023	\N	\N
856c0546-0762-4fd5-bbe8-de47bc282a27	Lemon X	rongsokheng4455@gmail.com	$2b$10$oWkz2xnVhBoO6YHN79hyXupDJyTv7ydPTYAN4bgWnIFrpClL4esoW	customer	2026-04-21 21:54:13.66224	\N	\N
a189c8ec-3cd0-4592-b1e1-8e5e675c9fdb	Rong Sokheng	rongsokheng148@gmail.com	$2b$10$gscHOXpAOHrcx/xzzUzXvOJcEVu6gitPEHbNgjFHri2DDoMjC9n2q	admin	2026-04-17 20:07:34.90066	\N	\N
\.


--
-- Data for Name: watchlist; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.watchlist (id, user_id, product_id, created_at) FROM stdin;
\.


--
-- Name: __drizzle_migrations_id_seq; Type: SEQUENCE SET; Schema: drizzle; Owner: postgres
--

SELECT pg_catalog.setval('drizzle.__drizzle_migrations_id_seq', 3, true);


--
-- Name: __drizzle_migrations __drizzle_migrations_pkey; Type: CONSTRAINT; Schema: drizzle; Owner: postgres
--

ALTER TABLE ONLY drizzle.__drizzle_migrations
    ADD CONSTRAINT __drizzle_migrations_pkey PRIMARY KEY (id);


--
-- Name: accounts accounts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.accounts
    ADD CONSTRAINT accounts_pkey PRIMARY KEY (id);


--
-- Name: bids bids_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bids
    ADD CONSTRAINT bids_pkey PRIMARY KEY (id);


--
-- Name: categories categories_name_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_name_unique UNIQUE (name);


--
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);


--
-- Name: categories categories_slug_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_slug_unique UNIQUE (slug);


--
-- Name: listings listings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.listings
    ADD CONSTRAINT listings_pkey PRIMARY KEY (id);


--
-- Name: order_items order_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_pkey PRIMARY KEY (id);


--
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (id);


--
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);


--
-- Name: products products_sku_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_sku_unique UNIQUE (sku);


--
-- Name: products products_slug_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_slug_unique UNIQUE (slug);


--
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (id);


--
-- Name: sessions sessions_session_token_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_session_token_unique UNIQUE (session_token);


--
-- Name: users users_email_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_unique UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: watchlist watchlist_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.watchlist
    ADD CONSTRAINT watchlist_pkey PRIMARY KEY (id);


--
-- Name: accounts accounts_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.accounts
    ADD CONSTRAINT accounts_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: bids bids_buyer_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bids
    ADD CONSTRAINT bids_buyer_id_users_id_fk FOREIGN KEY (buyer_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: bids bids_product_id_products_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bids
    ADD CONSTRAINT bids_product_id_products_id_fk FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;


--
-- Name: listings listings_product_id_products_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.listings
    ADD CONSTRAINT listings_product_id_products_id_fk FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;


--
-- Name: listings listings_seller_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.listings
    ADD CONSTRAINT listings_seller_id_users_id_fk FOREIGN KEY (seller_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: order_items order_items_order_id_orders_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_order_id_orders_id_fk FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE;


--
-- Name: order_items order_items_product_id_products_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_product_id_products_id_fk FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE SET NULL;


--
-- Name: orders orders_seller_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_seller_id_users_id_fk FOREIGN KEY (seller_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: orders orders_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: products products_category_id_categories_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_category_id_categories_id_fk FOREIGN KEY (category_id) REFERENCES public.categories(id) ON DELETE SET NULL;


--
-- Name: sessions sessions_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: watchlist watchlist_product_id_products_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.watchlist
    ADD CONSTRAINT watchlist_product_id_products_id_fk FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;


--
-- Name: watchlist watchlist_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.watchlist
    ADD CONSTRAINT watchlist_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict uDGmewY2aK0MurpOc6hk2Te5rbZOsY05Kq8ER49ml0K96tM3tIHDPMOgdE0vaOt

