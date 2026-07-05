-- Insert a Cosmetic Product (Fond de teint)
INSERT INTO products (name, brand, description, gender, category, is_featured, is_published, created_at)
VALUES ('Double Wear Teint', 'Estée Lauder', 'Fond de teint longue tenue avec une couvrance impeccable.', 'FEMME', 'COSMETIQUE', 1, 1, NOW());

SET @product1_id = LAST_INSERT_ID();

INSERT INTO product_variants (product_id, volume_ml, price, stock_quantity)
VALUES (@product1_id, 30, 210.00, 50);

-- Insert a Cosmetic Product (Rouge à lèvres)
INSERT INTO products (name, brand, description, gender, category, is_featured, is_published, created_at)
VALUES ('Rouge Dior', 'Dior', 'Rouge à lèvres couture - fini velours.', 'FEMME', 'COSMETIQUE', 1, 1, NOW());

SET @product2_id = LAST_INSERT_ID();

INSERT INTO product_variants (product_id, volume_ml, price, stock_quantity)
VALUES (@product2_id, 0, 185.00, 30);
