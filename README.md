# Run

```javascript
npm run start:dev
```

Admin user
```
{
  "username": "admin",
  "password": "adminadmin",
  "email": "admin@gmail.com",
  "countryCode": "BG"
}
```
Normal user
```
{
  "username": "user",
  "password": "useruser",
  "email": "user@gmail.com",
  "countryCode": "BG"
}
```


# REST API Task with NestJS
Implement a REST API to manage PRODUCTS and ORDERS, using JWT authentication and public VAT API to get country tax rates.


## Requirements

- Comply with REST standard - https://hackernoon.com/restful-api-designing-guidelines-the-best-practices-60e1d954e7c9
- Answer with the relevant status codes, based on the result
- Create an endpoint for PRODUCTS
  - Each product should have name, category, price
  - The API should support getting all products, adding a product, editing a product, deleting a product
  - The response format for all products is added bellow
  - Country code should be decoded from JWT token
  - Price should be returned as price from the database, including a VAT (next point)
  - Implement a VAT service to calculate the price, using this public API - https://jsonvat.com/
- Create an endpoint for ORDERS
  - Each order should have a date, products list (product ids) and status (Pending, Processing, Delivered, Cancelled)
  - The API should support getting all orders, adding an order (date should be automatically populated), change order status
  - The response format for all orders is added bellow
## Technologies

Technologies by choice. Optionally database can be in-memory for simplicity. Make sure to prepopulate with data however (categories, several products and orders)
- Implement authentication
  - A request should be send with username and password
  - A JWT token should be generated based on the credentials (hardcode 1 valid  - user)
  - Token validity should be set to 1h
  - The JWT token should be send and validated with each API call
  - Retrieving all PRODUCTS should be allowed for anonymous users
  - Relevant status code should be send if token is not provided or is invalid/ - expiredс
