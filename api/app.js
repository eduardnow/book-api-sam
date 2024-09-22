const { createBook, listBooks, getBook, updateBook, deleteBook } = require('./src/handlers/book');

exports.handler = async (event) => {
    const { httpMethod, path, body, pathParameters = {} } = event;

    try {
        switch (true) {
            case httpMethod === 'POST' && path === '/books':
                return createBook(JSON.parse(body));
            case httpMethod === 'GET' && path === '/books':
                return listBooks();
            case httpMethod === 'GET' && path.startsWith('/books/'):
                return getBook(pathParameters.id);
            case httpMethod === 'PUT' && path.startsWith('/books/'):
                return updateBook(pathParameters.id, JSON.parse(body));
            case httpMethod === 'DELETE' && path.startsWith('/books/'):
                return deleteBook(pathParameters.id);
            default:
                return {
                    statusCode: 400,
                    body: JSON.stringify({ message: 'Invalid request' })
                };
        }
    } catch (error) {
        console.error('Error handling request:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: error.message })
        };
    }
};