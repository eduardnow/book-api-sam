const { createBook, listBooks, getBook, updateBook, deleteBook } = require('./src/handlers/book');
const { authenticate } = require('./src/utils/auth');

exports.handler = async (event) => {
    const { httpMethod, path, body, pathParameters = {}, headers } = event;

    console.log('Event:', JSON.stringify(event, null, 2));

    try {
        const authHeader = headers.Authorization || headers.authorization;
        if (!authHeader) {
            console.log('No Authorization header found');
            return {
                statusCode: 401,
                body: JSON.stringify({ message: 'Unauthorized' })
            };
        }

        const token = authHeader.split(' ')[1];
        await authenticate(token);

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