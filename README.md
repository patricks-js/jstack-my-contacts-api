# JStack - My Contacts API

This is a RESTful API for managing contacts. It allows you to perform CRUD operations on contacts, including creating, retrieving, updating, and deleting contacts.

## Installation

1. Clone the repository:

    ```
    git clone https://github.com/your-username/contacts-api.git
    ```

2. Install dependencies:

    ```
    cd contacts-api
    npm install
    ```

3. Set up the database:

   - Install and run PostgreSQL (you can use the provided `docker-compose.yaml` file to set up a PostgreSQL container)
   - Run the SQL script in the `schemas.sql` file to create the necessary tables

4. Start the server:

    ```
    npm start
    ```

The API will be available at `http://localhost:3000` and the Swagger documentation at `http://localhost:3000/swagger`.

## Usage

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

## Testing

To run the tests, use the following command:

```
bun test
```

The tests cover the main functionality of the Contacts API.
