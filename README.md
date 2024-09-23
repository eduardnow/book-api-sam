# Books API

This project is an API for managing books using AWS SAM (Serverless Application Model).

> ℹ️ **Información:** Este proyecto no pretende cubrir todos los aspectos necesarios para una solución en un ambiente de producción. El propósito es principalmente evaluar y demostrar los fundamentos de AWS SAM.


## Description

The API allows performing CRUD (Create, Read, Update, Delete) operations on a DynamoDB table that stores information about books. The API is implemented in Node.js and uses AWS Lambda for function execution.

## Project Structure

- `api/`: Contains the API source code.
    - `app.js`: Main file that handles HTTP requests.
    - `src/handlers/book.js`: Contains functions to handle CRUD operations.
    - `.env`: Environment configuration file.
    - `.eslintrc.js`: ESLint configuration.
    - `.prettierrc.js`: Prettier configuration.
    - `jest.config.js`: Jest configuration for tests.
    - `package.json`: npm configuration file.
- `sam-template.yaml`: AWS SAM template for deploying the infrastructure.
- `samconfig.toml`: SAM CLI configuration.
- `scratch.http`: File for performing HTTP tests.

## Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/educastrog/books-api.git
    cd books-api
    ```

2. Install the dependencies:
    ```sh
    cd api
    npm install
    ```

## Configuration

Create a `.env` file in the `api/` directory with the following content:
```dotenv
TABLE_NAME=BooksTable
AWS_REGION=local
```

## npm Scripts

- `test`: Runs tests with Jest.
- `build`: Builds the project using esbuild.

## Deployment

To deploy the API using AWS SAM, run the following commands:

1. Build the project:
    ```sh
    sam build
    ```

2. Deploy the project:
    ```sh
    sam deploy --guided
    ```

## Usage

You can use the `scratch.http` file to perform HTTP tests on the API. Make sure to update the URLs and headers as necessary.

## Dependencies

### Production

- `@aws-sdk/client-dynamodb`
- `@aws-sdk/lib-dynamodb`
- `aws-sdk-client-mock`
- `body-parser`
- `dotenv`
- `express`
- `uuid`

### Development

- `esbuild`
- `jest`

## ESLint and Prettier Configuration

The project uses ESLint and Prettier to maintain consistent code style. The configuration is found in the `.eslintrc.js` and `.prettierrc.js` files.

## Tests

Tests are configured with Jest. You can run the tests with the following command:
```sh
npm test
```

## License

This project is licensed under the MIT License.

## Author

Eduard Castro
