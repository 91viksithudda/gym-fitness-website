# Coupon Troubleshooting Guide

## Common Coupon Issues and Solutions

### 1. "Invalid or expired coupon" Error

#### Problem:
When entering a coupon code, you receive the message "Invalid or expired coupon".

#### Possible Causes:
1. **Expired Coupon**: The coupon's expiration date has passed
2. **Inactive Coupon**: The coupon has been deactivated
3. **Maximum Uses Reached**: The coupon has been used the maximum number of times
4. **Typo in Coupon Code**: The code was entered incorrectly
5. **Coupon Doesn't Exist**: The coupon code was never created

#### Solutions:

1. **Check Expiration Date**:
   - Run `node list-coupons.js` to see all coupons and their expiration dates
   - Ensure the current date is before the expiration date

2. **Verify Coupon Status**:
   - Check if the coupon is marked as active
   - Run `node test-coupon-validation.js <COUPON_CODE>` to test a specific coupon

3. **Check Usage Limits**:
   - Verify the coupon hasn't reached its maximum uses
   - Look at the "usedCount" vs "maxUses" values

4. **Correct the Code**:
   - Ensure there are no typos
   - Coupon codes are case-insensitive but must match exactly

5. **Create New Coupon**:
   - If the coupon doesn't exist, create it through the admin panel
   - Or run `node create-valid-coupon.js` to create/update a coupon

### 2. Coupon Not Applying Discount

#### Problem:
The coupon is validated but doesn't reduce the price.

#### Possible Causes:
1. **Frontend Not Updating**: The UI isn't reflecting the discount
2. **Backend Calculation Error**: The discount calculation is incorrect
3. **Network Issues**: API calls are failing

#### Solutions:

1. **Refresh the Page**:
   - Try refreshing the subscription page
   - Clear browser cache if needed

2. **Check Browser Console**:
   - Open Developer Tools (F12)
   - Look for JavaScript errors
   - Check Network tab for failed API requests

3. **Verify Calculation**:
   - Run `node test-coupon-api.js` to test discount calculation
   - Ensure the formula is: `discountAmount = originalPrice * (discountPercent / 100)`

### 3. Creating New Coupons

#### Through Admin Panel:
1. Navigate to the Admin Dashboard
2. Go to "Coupon Management"
3. Fill in the form:
   - **Coupon Code**: Unique identifier (e.g., "WELCOME2025")
   - **Discount**: Percentage (1-10%)
   - **Expiration Date**: Future date
   - **Maximum Uses**: Optional limit
4. Click "Create Coupon"

#### Through Command Line:
1. Run `node create-valid-coupon.js`
2. Modify the script to set your desired coupon details
3. The script will either create a new coupon or update an existing one

### 4. Testing Coupons

#### List All Coupons:
```bash
cd "c:\Users\viksi\OneDrive\Documents\ai produt\gym-fitness-website\backend"
node list-coupons.js
```

#### Test Specific Coupon:
```bash
node test-coupon-validation.js
```

#### Test Discount Calculation:
```bash
node test-coupon-api.js
```

## Coupon Best Practices

### 1. Expiration Dates
- Set expiration dates well in the future
- Use dates like "2026-12-31" rather than near-future dates
- Consider seasonal promotions (e.g., end of year, summer sales)

### 2. Usage Limits
- Set reasonable maximum uses for limited promotions
- Use unlimited uses for general promotions
- Monitor usage statistics through the admin panel

### 3. Discount Percentages
- Stick to the 10% maximum limit for security
- Use smaller percentages (5-7%) for regular promotions
- Reserve higher discounts (8-10%) for special occasions

### 4. Coupon Codes
- Use memorable, easy-to-type codes
- Avoid confusing characters (0/O, 1/I/l)
- Include brand or promotion references when possible

## Example Valid Coupons

These coupons should work in your system:

1. **WELCOME10** - 10% off, expires 2026-12-31
2. **FITNESS20** - 10% off (limited to 10% max), expires 2026-12-31
3. **NEWYEAR15** - 10% off (limited to 10% max), expires 2026-12-31
4. **HUDDA3567** - 10% off, expires 2026-12-31

## Troubleshooting Steps

If you continue to have issues:

1. **Verify Backend is Running**:
   ```bash
   cd "c:\Users\viksi\OneDrive\Documents\ai produt\gym-fitness-website\backend"
   npm run dev
   ```

2. **Verify Frontend is Running**:
   ```bash
   cd "c:\Users\viksi\OneDrive\Documents\ai produt\gym-fitness-website\frontend"
   npm start
   ```

3. **Check MongoDB Connection**:
   - Ensure MongoDB service is running
   - Verify connection string in `.env` file

4. **Test API Endpoints**:
   - Try accessing `http://localhost:5001/api/coupons` in your browser
   - You should see a list of coupons in JSON format

5. **Clear Browser Cache**:
   - Hard refresh the page (Ctrl+F5)
   - Try in an incognito/private browsing window

## Contact Support

If you continue to experience issues:
1. Check the browser console for error messages
2. Verify all servers are running
3. Ensure MongoDB is accessible
4. Contact support with specific error messages and steps to reproduce