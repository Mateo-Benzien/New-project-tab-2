# E-Commerce Product Listing

## Overview

This project is an e-commerce product listing web application built with Next.js. It allows users to view a list of products, navigate between pages, and view detailed information about each product.

## Features

- **Fetch Products**: Retrieves the first 20 products and supports pagination to fetch the next set of products.
- **Error Handling**: Displays friendly error messages if data fetching fails.
- **Server-Side Rendering**: Renders product data on the server for improved performance.
- **Loading State**: Shows a loading indicator while new data is being fetched.
- **Pagination Controls**: Includes next/previous buttons and page numbers to navigate through product pages.
- **Product Details**: Allows users to view detailed information about each product, including images, price, category, description, tags, rating, stock availability, and reviews.

## User Experience

- **Main Products Page**: Displays a grid of product cards with images, titles, prices, and categories.
- **Product Image Preview**: Supports multiple product images with scrolling controls.
- **Product Navigation**: Users can click on a product to navigate to a detailed view and return to the product list.

## Development

### Setup

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```

2. Navigate to the project directory:
   ```bash
   cd <project-directory> (next-ecommerce_2)
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open `http://localhost:3000` in your browser.

### Technologies Used

- **Next.js**: For server-side rendering and routing.
- **React**: For building user interfaces.
- **CSS**: For styling the application.

### API

- **Products API**: Data is fetched from `https://next-ecommerce-api.vercel.app/products`.
- **Individual Product Endpoint**: Fetch detailed product data from an individual product endpoint.

