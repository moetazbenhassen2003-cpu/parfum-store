# Parfum Store - Luxury Perfume E-Commerce Platform

A full-stack luxury perfume storefront with Instagram-style product showcase, built with Angular 17+ and Spring Boot 3+.

## Tech Stack

### Frontend
- **Framework**: Angular 17+
- **Styling**: Tailwind CSS
- **State Management**: RxJS (BehaviorSubject)
- **HTTP Client**: Angular HttpClient
- **Auth**: JWT with interceptors

### Backend
- **Framework**: Spring Boot 3.2
- **Language**: Java 17
- **Database**: MySQL 8+
- **ORM**: Spring Data JPA + Hibernate
- **Security**: Spring Security + JWT
- **File Upload**: Multipart upload to local storage

### Deployment
- **Frontend**: Vercel (free tier)
- **Backend + DB**: Railway (free tier)

---

## Prerequisites

- **Java 17** or higher
- **Node.js 18** or higher
- **MySQL 8** or higher
- **Maven 3.6+**
- **Angular CLI 17**

---

## Local Setup

### 1. Database Setup

Create MySQL database:

```sql
CREATE DATABASE parfum_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 2. Backend Setup

Navigate to backend directory:

```bash
cd parfum-store/backend
```

Update `src/main/resources/application.properties` with your MySQL credentials:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/parfum_db?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC
spring.datasource.username=YOUR_MYSQL_USERNAME
spring.datasource.password=YOUR_MYSQL_PASSWORD
```


Install dependencies and run:

```bash
mvn clean install
mvn spring-boot:run
```

The backend will start on `http://localhost:8080`

### 3. Frontend Setup

Navigate to frontend directory:

```bash
cd parfum-store/frontend
```

Install dependencies:

```bash
npm install
```

Run development server:

```bash
npm start
```

The frontend will start on `http://localhost:4200`

---

## Environment Variables

### Backend (application.properties)

```properties
# Database
spring.datasource.url=jdbc:mysql://localhost:3306/parfum_db
spring.datasource.username=root
spring.datasource.password=

# JWT
jwt.secret=YOUR_SECRET_KEY_HERE
jwt.expiration=86400000

# File Upload
spring.servlet.multipart.max-file-size=5MB
spring.servlet.multipart.max-request-size=20MB
```

### Frontend

**Development** (`src/environments/environment.ts`):
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080'
};
```

**Production** (`src/environments/environment.prod.ts`):
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://YOUR-RAILWAY-APP.up.railway.app'
};
```

---

## Deployment Guide

### Deploy Backend to Railway

1. Push your Spring Boot project to GitHub
2. Go to [railway.app](https://railway.app) and create account
3. Create new project → Deploy from GitHub repo
4. Add MySQL service:
   - Click "New" → "Database" → "Add MySQL"
   - Railway will provision MySQL and provide credentials


5. Set environment variables in Railway:
   ```
   SPRING_DATASOURCE_URL=jdbc:mysql://[RAILWAY_MYSQL_HOST]:[PORT]/[DATABASE]
   SPRING_DATASOURCE_USERNAME=[RAILWAY_MYSQL_USERNAME]
   SPRING_DATASOURCE_PASSWORD=[RAILWAY_MYSQL_PASSWORD]
   JWT_SECRET=your_secure_jwt_secret_key_minimum_32_characters
   ```

6. Railway will auto-detect Maven and deploy your app
7. Copy the generated Railway URL (e.g., `https://parfum-backend.up.railway.app`)

### Deploy Frontend to Vercel

1. Push your Angular project to GitHub
2. Go to [vercel.com](https://vercel.com) and import your repository
3. Configure build settings:
   - **Framework Preset**: Angular
   - **Build Command**: `npm run build:prod`
   - **Output Directory**: `dist/parfum-frontend/browser`

4. Add environment variable:
   ```
   VITE_API_URL=https://your-railway-app.up.railway.app
   ```

5. Update `src/environments/environment.prod.ts` with your Railway URL
6. Deploy!

### Update CORS Configuration

After deployment, update `backend/src/main/java/com/parfum/config/CorsConfig.java`:

```java
configuration.setAllowedOrigins(Arrays.asList(
    "http://localhost:4200",
    "https://your-vercel-app.vercel.app"
));
```

Redeploy the backend to Railway.

---

## API Endpoints

### Authentication (Public)
- `POST /api/auth/register` - Register new client
- `POST /api/auth/login` - Login and get JWT token
- `GET /api/auth/me` - Get current user (authenticated)

### Products (Public)
- `GET /api/products` - List all published products (paginated)
- `GET /api/products/{id}` - Get product details
- `GET /api/products/featured` - Get featured products
- `GET /api/products/search?q=` - Search products

### Orders (Client - ROLE_CLIENT)
- `POST /api/orders` - Create new order
- `GET /api/orders/my-orders` - Get user's order history

### Admin Products (ROLE_ADMIN)
- `GET /api/admin/products` - Get all products (including unpublished)
- `POST /api/admin/products` - Create product
- `PUT /api/admin/products/{id}` - Update product
- `DELETE /api/admin/products/{id}` - Delete product
- `PATCH /api/admin/products/{id}/publish` - Toggle published status
- `PATCH /api/admin/products/{id}/featured` - Toggle featured status
- `POST /api/admin/products/{id}/images` - Upload images
- `DELETE /api/admin/products/{id}/images/{imageId}` - Delete image

### Admin Orders (ROLE_ADMIN)
- `GET /api/admin/orders` - Get all orders (filterable by status)
- `GET /api/admin/orders/{id}` - Get order details
- `PATCH /api/admin/orders/{id}/status` - Update order status
- `GET /api/admin/dashboard/stats` - Get dashboard statistics

---

## Default Admin Account

To create an admin account, insert directly into MySQL:

```sql
INSERT INTO users (full_name, email, password_hash, phone, role, created_at)
VALUES (
  'Admin',
  'admin@parfum.com',
  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
  '0555123456',
  'ADMIN',
  NOW()
);
```

**Login Credentials:**
- Email: `admin@parfum.com`
- Password: `admin123`

---

## Database Schema

The following tables are auto-generated by Hibernate:

### users
- `id` (PK, auto-increment)
- `full_name`
- `email` (unique)
- `password_hash`
- `phone`
- `role` (ADMIN / CLIENT)
- `created_at`

### products
- `id` (PK)
- `name`
- `brand`
- `description`
- `gender` (HOMME / FEMME / MIXTE)
- `is_featured`
- `is_published`
- `created_at`

### product_variants
- `id` (PK)
- `product_id` (FK)
- `volume_ml`
- `price`
- `stock_quantity`

### product_images
- `id` (PK)
- `product_id` (FK)
- `image_url`
- `is_primary`

### product_tags
- `id` (PK)
- `product_id` (FK)
- `tag_name`

### orders
- `id` (PK)
- `client_id` (FK)
- `total_price`
- `status` (EN_ATTENTE / CONFIRMEE / EN_LIVRAISON / LIVREE / ANNULEE)
- `note`
- `delivery_full_name`
- `delivery_phone`
- `delivery_wilaya`
- `delivery_city`
- `delivery_street`
- `created_at`
- `updated_at`

### order_items
- `id` (PK)
- `order_id` (FK)
- `product_variant_id` (FK)
- `quantity`
- `unit_price`

### addresses
- `id` (PK)
- `user_id` (FK)
- `wilaya`
- `city`
- `street`
- `is_default`

---

## Features

### Storefront (Public)
✅ Instagram-style product grid with hover effects  
✅ Product detail page with image gallery  
✅ Variant selector (volume/price)  
✅ Shopping cart with quantity management  
✅ Guest checkout with delivery information  
✅ Product search and filtering (gender, price, tags)  
✅ Featured products showcase  
✅ Responsive mobile-first design  

### Client Dashboard (ROLE_CLIENT)
✅ Order history with status tracking  
✅ Profile management  

### Admin Panel (ROLE_ADMIN)
✅ Product management (CRUD)  
✅ Multi-image upload with primary image selection  
✅ Inventory management (stock tracking)  
✅ Order management with status updates  
✅ Dashboard with real-time statistics  
✅ Published/Featured toggle for products  

### Security
✅ JWT authentication with 24h expiry  
✅ Role-based access control (ADMIN / CLIENT)  
✅ Secure password hashing (BCrypt)  
✅ HTTP-only token storage  
✅ CORS configuration for production  

---

## Project Structure

```
parfum-store/
├── backend/
│   ├── src/main/java/com/parfum/
│   │   ├── config/          # Security, CORS, WebMvc configs
│   │   ├── controller/      # REST endpoints
│   │   ├── service/         # Business logic
│   │   ├── repository/      # JPA repositories
│   │   ├── entity/          # JPA entities
│   │   ├── dto/             # Data transfer objects
│   │   ├── security/        # JWT utilities
│   │   └── exception/       # Exception handling
│   ├── src/main/resources/
│   │   └── application.properties
│   ├── uploads/             # Image storage
│   └── pom.xml
│
└── frontend/
    ├── src/app/
    │   ├── core/
    │   │   ├── guards/      # Auth & Admin guards
    │   │   ├── interceptors/# JWT & Error interceptors
    │   │   ├── services/    # API services
    │   │   └── models/      # TypeScript interfaces
    │   ├── shared/
    │   │   ├── components/  # Reusable components
    │   │   └── pipes/       # Custom pipes
    │   └── features/
    │       ├── auth/        # Login & Register
    │       ├── storefront/  # Home, Catalog, Product detail
    │       ├── cart/        # Cart & Checkout
    │       ├── client/      # Client dashboard
    │       └── admin/       # Admin panel
    ├── src/environments/
    ├── tailwind.config.js
    └── package.json
```

---

## Algerian Wilayas (for Delivery)

The checkout form includes a select dropdown with all 58 Algerian wilayas:

Alger, Oran, Constantine, Annaba, Blida, Batna, Sétif, Sidi Bel Abbès, Biskra, Tébessa, Tiaret, Béjaïa, Tlemcen, Ouargla, Béchar, Mostaganem, Bordj Bou Arréridj, Chlef, Médéa, El Oued, Skikda, Jijel, Guelma, Laghouat, M'Sila, Saïda, Djelfa, Oran, Tindouf, Tissemsilt, El Bayadh, Illizi, Bordj Badji Mokhtar, Ouled Djellal, Béni Abbès, In Salah, In Guezzam, Touggourt, Djanet, El M'Ghair, El Meniaa, Adrar, Aïn Defla, Aïn Témouchent, Bouira, Boumerdès, El Tarf, Ghardaïa, Khenchela, Mila, Naâma, Relizane, Souk Ahras, Tamanrasset, Timimoun.

---

## Color Palette

```css
--color-bg:          #0A0A0A   /* Main background */
--color-surface:     #141414   /* Cards, sidebar */
--color-surface-2:   #1E1E1E   /* Inputs, hover states */
--color-gold:        #C9A84C   /* Primary accent */
--color-gold-hover:  #E2BE6E   /* Gold hover state */
--color-text:        #F5F0E8   /* Primary text (ivory) */
--color-muted:       #888888   /* Secondary text */
--color-danger:      #E53E3E   /* Error states */
--color-success:     #38A169   /* Success states */
```

Typography:
- **Display**: Cormorant Garamond (Google Fonts)
- **Body**: Inter (Google Fonts)

---

## Testing

### Create Sample Product (via API)

```bash
curl -X POST http://localhost:8080/api/admin/products \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "La Nuit de l'Homme",
    "brand": "Yves Saint Laurent",
    "description": "Un parfum masculin séduisant et mystérieux",
    "gender": "HOMME",
    "isFeatured": true,
    "isPublished": true,
    "tags": ["oriental", "boisé", "épicé"],
    "variants": [
      { "volumeMl": 60, "price": 8500, "stockQuantity": 15 },
      { "volumeMl": 100, "price": 12000, "stockQuantity": 10 }
    ]
  }'
```

---

## Troubleshooting

### Backend Won't Start
- Check MySQL is running: `sudo systemctl status mysql`
- Verify database exists: `SHOW DATABASES;`
- Check Java version: `java -version` (must be 17+)
- Check Maven: `mvn -version`

### Frontend CORS Errors
- Ensure backend CORS config includes `http://localhost:4200`
- Check backend is running on port 8080
- Verify `environment.ts` has correct API URL

### JWT Token Issues
- Token expires after 24h (86400000ms)
- Clear localStorage and re-login
- Check JWT secret is set in `application.properties`

### Image Upload Fails
- Check `uploads/products/` directory exists and has write permissions
- Verify file size < 5MB
- Accepted formats: JPG, PNG, WebP

### Railway Deployment Issues
- Ensure environment variables are set correctly
- Check Railway logs for errors
- Verify MySQL service is connected
- Use Railway's internal MySQL URL

---

## License

This project is for educational and commercial use.

---

## Support

For issues or questions:
- Check the troubleshooting section
- Review API endpoint documentation
- Verify environment configuration

---

## Development Tips

1. **Use hot reload** during development with `ng serve` and `mvn spring-boot:run`
2. **Check browser console** for frontend errors
3. **Monitor backend logs** for API errors
4. **Use Postman** to test API endpoints directly
5. **Keep tokens** in localStorage for persistent auth
6. **Clear cart** between tests using browser DevTools

---

Built with ❤️ for luxury perfume retailers in Algeria.
