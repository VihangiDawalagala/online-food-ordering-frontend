# Online Food Ordering Frontend

React TypeScript frontend for the CMJD Comprehensive Master Java Developer coursework: Online Food Ordering System.

Repository: [VihangiDawalagala/online-food-ordering-frontend](https://github.com/VihangiDawalagala/online-food-ordering-frontend)

## Project Overview

This application provides the frontend for an online food ordering system. It supports customer food browsing, authentication, cart management, order placement, payment handling, and admin management features.

## Tech Stack

- React
- TypeScript
- React Router
- Axios
- Tailwind CSS
- Vite

## Features

- Sign in and sign up pages
- JWT authentication handling
- Role-based navigation
- Protected customer routes
- Protected admin routes
- Food browsing and search
- Food details page
- Cart add, update, and remove actions
- Order placement and order tracking
- Payment page
- Admin dashboard
- Food management
- Category management
- Order management
- User management
- Responsive user interface

## Project Structure

```text
src/
  api/          Axios API services
  components/   Reusable UI components
  context/      Authentication context
  pages/        Application pages
  types/        TypeScript interfaces
```

## Getting Started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Build the project:

```bash
npm run build
```

Run lint checks:

```bash
npm run lint
```

## Backend API

The frontend is configured to connect to the backend API at:

```text
http://localhost:8080/api
```

Make sure the backend server is running before testing authentication, cart, orders, payments, and admin features.

## Coursework

Course: CMJD - Comprehensive Master Java Developer  
Batch: 112/113  
Assignment: Front-End Development with React  
Task: Online Food Ordering System
