# Coupon System Documentation

## How the Coupon System Works

### 1. Creating Coupons (Admin Dashboard)
1. Navigate to the Admin Panel
2. Fill in the coupon details:
   - **Coupon Code**: A unique identifier (e.g., WELCOME10)
   - **Discount Percentage**: Up to 10% maximum
   - **Expiration Date**: When the coupon expires
   - **Maximum Uses**: Optional limit on how many times the coupon can be used
3. Click "Create Coupon"

### 2. Applying Coupons (Subscription Page)
1. Go to the Subscription page
2. Enter the coupon code in the "Apply Coupon" section
3. Click "Apply" to validate the coupon
4. The system will show the discount amount and reduced price
5. Proceed with subscription using the discounted price

### 3. Pricing Calculation
- **Original Subscription Price**: ₹250/month
- **Discount Calculation**: Original Price × (Discount Percentage / 100)
- **Final Price**: Original Price - Discount Amount

#### Example Calculations:
- 10% coupon: ₹250 - (₹250 × 0.10) = ₹250 - ₹25 = ₹225
- 5% coupon: ₹250 - (₹250 × 0.05) = ₹250 - ₹12.50 = ₹237.50 (rounded to ₹237)

### 4. Technical Implementation

#### Frontend Components:
- **Admin.js**: Coupon creation interface
- **Subscription.js**: Coupon application and price calculation

#### Backend Routes:
- **POST /api/coupons**: Create new coupon
- **POST /api/coupons/validate**: Validate coupon code
- **POST /api/payments/create-subscription**: Create subscription with coupon
- **POST /api/payments/create**: Create one-time payment with coupon

#### Data Flow:
1. Admin creates coupon via `/api/coupons`
2. User enters coupon code on Subscription page
3. Frontend validates coupon via `/api/coupons/validate`
4. System calculates discounted price
5. User completes payment with discounted amount
6. Backend tracks coupon usage in database

### 5. Security Features
- Maximum discount limited to 10%
- Coupon expiration dates enforced
- Usage limits (if specified) enforced
- Coupon usage tracked per user

### 6. Admin Features
- View all created coupons
- See usage statistics for each coupon
- Track which users have used which coupons
- Monitor coupon effectiveness