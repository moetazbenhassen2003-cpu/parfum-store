INSERT IGNORE INTO users (full_name, email, password_hash, phone, role, created_at)
VALUES (
  'Admin',
  'admin@parfum.com',
  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
  '0555123456',
  'ADMIN',
  NOW()
);

SELECT id, full_name, email, role FROM users;
