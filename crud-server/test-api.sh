#!/bin/bash

# Test script for Product CRUD API
# Make sure the server is running on http://localhost:3000

BASE_URL="http://localhost:3000/api/products"

echo "🧪 Testing Product CRUD API"
echo "============================"
echo ""

# Test 1: Create a product
echo "1️⃣  Creating a new product..."
CREATE_RESPONSE=$(curl -s -X POST $BASE_URL \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Laptop",
    "description": "High-performance laptop",
    "price": 1299.99,
    "stock": 10
  }')
echo "$CREATE_RESPONSE" | python3 -m json.tool
PRODUCT_ID=$(echo $CREATE_RESPONSE | python3 -c "import sys, json; print(json.load(sys.stdin)['data']['id'])")
echo ""

# Test 2: Create another product
echo "2️⃣  Creating another product..."
curl -s -X POST $BASE_URL \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Mouse",
    "description": "Wireless gaming mouse",
    "price": 49.99,
    "stock": 50
  }' | python3 -m json.tool
echo ""

# Test 3: Get all products
echo "3️⃣  Getting all products..."
curl -s $BASE_URL | python3 -m json.tool
echo ""

# Test 4: Get product by ID
echo "4️⃣  Getting product by ID ($PRODUCT_ID)..."
curl -s $BASE_URL/$PRODUCT_ID | python3 -m json.tool
echo ""

# Test 5: Update product
echo "5️⃣  Updating product..."
curl -s -X PUT $BASE_URL/$PRODUCT_ID \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Gaming Laptop",
    "description": "High-performance gaming laptop",
    "price": 1499.99,
    "stock": 5
  }' | python3 -m json.tool
echo ""

# Test 6: Get updated product
echo "6️⃣  Getting updated product..."
curl -s $BASE_URL/$PRODUCT_ID | python3 -m json.tool
echo ""

# Test 7: Delete product
echo "7️⃣  Deleting product..."
curl -s -X DELETE $BASE_URL/$PRODUCT_ID | python3 -m json.tool
echo ""

# Test 8: Try to get deleted product (should return 404)
echo "8️⃣  Trying to get deleted product (should fail)..."
curl -s $BASE_URL/$PRODUCT_ID | python3 -m json.tool
echo ""

# Test 9: Validation error test
echo "9️⃣  Testing validation (missing required fields)..."
curl -s -X POST $BASE_URL \
  -H "Content-Type: application/json" \
  -d '{
    "name": "",
    "price": -10
  }' | python3 -m json.tool
echo ""

echo "✅ All tests completed!"
