# JStack - My Contacts API

This project was developed as part of the **JStack course**, which focuses on building modern web APIs with Node.js and PostgreSQL. However, instead of just following the default stack, I took the opportunity to **experiment with new technologies and go beyond the course material** — using tools like **Bun**, **Elysia**, and **Redis** to bring performance, modern syntax, and better developer experience to the table.

The API manages **contacts** and **categories**, offering full CRUD operations, caching, documentation, and automated testing.

## 🚀 What I Did Differently

While the original course used **Node.js**, **Express**, and the `pg` library for PostgreSQL integration, I decided to refactor the entire backend with a more modern approach:

- 🔄 **Replaced Express with Elysia**: a lightweight and high-performance web framework built on Bun, offering a better DX and faster routing.
- 🧠 **Used Bun’s native `sql` function** instead of `pg`: reducing dependencies and improving performance by leveraging Bun’s tight PostgreSQL integration.
- ⚡️ **Integrated Redis for caching and deletion logic**: though I’ve only scratched the surface of Redis, it already helps improve response times for repeated queries.
- 🧪 **Set up tests using Bun’s built-in test runner**: no need for external libs like Jest or Mocha — keeping things fast and simple.
- 📦 **Dockerized the entire environment** for portability and ease of setup.

## 🛠️ Features

- Full **CRUD** operations for **contacts** and **categories**
- **PostgreSQL** database integration with optimized queries
- **Redis** caching layer for performance boost
- **Docker** support for containerized development
- **Swagger** API documentation
- **Automated testing** with **Bun’s native test runner**

## ⚒️ Technologies Used

- **TypeScript** – type-safe development
- **Bun** – runtime, package manager, and test runner
- **Elysia** – high-performance web framework
- **PostgreSQL** – relational database
- **Redis** – simple caching layer
- **Swagger** – auto-generated documentation
- **Docker** – dev environment containerization

## 📚 What This Project Shows

- Ability to go beyond course content and choose better-suited tools
- Comfortable working with both relational databases and caching systems
- Solid understanding of API design, testing, and documentation
- Familiarity with containerization and project portability

## 📃 Installation

### Prerequisites

- Bun installed
- Docker & Docker Compose

### Steps

1. **Clone the repository:**

    ```sh
    git clone https://github.com/patricks-js/jstack-my-contacts-api.git
    cd jstack-my-contacts-api
    ```

2. **Install dependencies:**

    ```sh
    bun install
    ```

3. **Set up the environment variables:**

    - Create a `.env` file in the root directory
    - Add the following variables:
        ```env
        DATABASE_URL=postgresql://my_contacts:my_contacts@localhost:5432/my_contacts_db
        REDIS_URL=redis://localhost:6379
        PORT=3000
       ```

4. **Up the containers:**

    ```sh
    docker-compose up -d
    ```

5. **Start the server:**

    ```sh
    bun start
    ```

The API will be available at `http://localhost:3000` and the Swagger documentation at `http://localhost:3000/swagger`.

## 🗾 API Endpoints

The Contacts API provides the following endpoints:

### Contacts

- `GET /contacts`: Get all contacts
- `GET /contacts/:id`: Get a contact by ID
- `POST /contacts`: Create a new contact
- `PUT /contacts/:id`: Update a contact
- `DELETE /contacts/:id`: Delete a contact

### Categories

- `GET /categories`: Get all categories
- `GET /categories/:id`: Get a category by ID
- `GET /categories/query?name=`: Find a category by name
- `POST /categories`: Create a new category
- `PUT /categories/:id`: Update a category
- `DELETE /categories/:id`: Delete a category

## 🧲 Cache Utilities

The project includes caching utilities implemented in `src/functions/cache/`. These utilities leverage Redis to improve the performance of the API by caching frequently accessed data and revalidating cache entries when necessary.

## 🧪 Testing

To run the tests, use the following command:

```sh
bun test
```

The tests cover the main functionality of the Contacts API.
