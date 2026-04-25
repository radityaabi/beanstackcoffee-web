# Beanstack Coffee - Frontend

Frontend web application untuk Beanstack Coffee, sebuah e-commerce biji kopi Indonesia.

## Tech Stack

- **Framework**: React 19 + TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS 4 + shadcn/ui
- **State Management**: TanStack React Query
- **Routing**: React Router DOM
- **API Client**: openapi-fetch (type-safe from OpenAPI schema)
- **Icons**: Phosphor Icons

## Pages

| Route             | Halaman        | Deskripsi                                         |
| ----------------- | -------------- | ------------------------------------------------- |
| `/`               | Home           | Landing page with favorite products               |
| `/products`       | Products       | Product catalog with filter, search, & pagination |
| `/products/:slug` | Product Detail | Product detail & add to cart                      |
| `/cart`           | Cart           | Shopping cart                                     |
| `/dashboard`      | Dashboard      | Account summary & shopping activity               |
| `/login`          | Login          | Login page                                        |
| `/register`       | Register       | Registration page                                 |

## Getting Started

Install dependencies:

```sh
bun install
```

Generate API types from backend (make sure the backend is running at `localhost:3000`):

```sh
bun gen
```

Run development server:

```sh
bun dev
```

Open <http://localhost:5173>.

## Scripts

| Script      | Description                                 |
| ----------- | ------------------------------------------- |
| `bun dev`   | Run development server                      |
| `bun build` | Build production bundle                     |
| `bun gen`   | Generate TypeScript types from OpenAPI spec |
