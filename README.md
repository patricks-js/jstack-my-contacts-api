# JStack - My Contacts API

This project shows my ability to build a RESTful API using TypeScript, PostgreSQL, and Redis. The API manages contacts and categories, allowing users to perform CRUD operations. The project includes full documentation and testing capabilities.

## Features

- **CRUD** operations for **contacts** and **categories**
- **PostgreSQL** database integration
- **Redis** for caching
- **Docker** support for easy setup
- **Swagger** documentation for API endpoints
- **Automated testing** with bun

## Technologies Used

- **TypeScript**: For type safety and better code maintainability
- **PostgreSQL**: As the database solution
- **Redis**: For caching
- **Docker**: For easy setup and deployment
- **Swagger**: For API documentation
- **bun**: As runtime, package manager and test runner

## Demonstration

This project demonstrates my ability to:

- Develop a RESTful API using TypeScript
- Integrate a PostgreSQL database with an API
- Use Redis for caching to improve performance
- Use Docker for containerization
- Document APIs with Swagger
- Write and run comprehensive tests

## Installation

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

## API Endpoints

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

## Cache Utilities

The project includes caching utilities implemented in `src/functions/cache/`. These utilities leverage Redis to improve the performance of the API by caching frequently accessed data and revalidating cache entries when necessary.

## Testing

To run the tests, use the following command:

```sh
bun test
```

The tests cover the main functionality of the Contacts API.
