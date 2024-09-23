require('dotenv').config();
const { createBook, listBooks, getBook, updateBook, deleteBook } = require('../src/handlers/book');
const {
    mockClient
} = require('aws-sdk-client-mock');
const {
    DynamoDBDocumentClient,
    PutCommand,
    ScanCommand,
    GetCommand,
    UpdateCommand,
    DeleteCommand
} = require('@aws-sdk/lib-dynamodb');

const ddbMock = mockClient(DynamoDBDocumentClient);

describe('Books Handler', () => {
    const TABLE_NAME = 'BooksTable';

    beforeEach(() => {
        ddbMock.reset();
        process.env.TABLE_NAME = TABLE_NAME;
    });

    describe('createBook', () => {
        test('should create a book successfully', async () => {
            const book = {
                id: 'bd26db56-9ff0-4c12-be67-710ce2ad1293',
                title: 'Clean Code',
                author: 'Robert C. Martin',
                pages: 464,
                isbn: '978-3-16-148410-0',
            };

            ddbMock.on(PutCommand).resolves({});

            const result = await createBook(book);

            expect(ddbMock.calls()).toHaveLength(1);
            const call = ddbMock.calls()[0];
            expect(call.args[0].input).toEqual({
                TableName: TABLE_NAME,
                Item: book
            });
            expect(result).toEqual({ statusCode: 201, body: JSON.stringify(book) });
        });

        test('should return 400 for invalid data', async () => {
            const book = {};

            const result = await createBook(book);

            expect(result).toEqual({ statusCode: 400, body: JSON.stringify({ message: 'Missing required field(s): id, title, author, pages, isbn' }) });
        });

        test('should return 500 for DynamoDB error', async () => {
            const book = {
                id: 'bd26db56-9ff0-4c12-be67-710ce2ad1293',
                title: 'Clean Code',
                author: 'Robert C. Martin',
                pages: 464,
                isbn: '978-3-16-148410-0',
            };

            ddbMock.on(PutCommand).rejects(new Error('DynamoDB error'));

            const result = await createBook(book);

            expect(ddbMock.calls()).toHaveLength(1);
            expect(result).toEqual({ statusCode: 500, body: JSON.stringify({ message: 'Internal Server Error' }) });
        });
    });

    describe('listBooks', () => {
        test('should list books successfully', async () => {
            const books = [
                { id: 'ba0b748b-7b2f-4b68-b6df-0e6c724a799b', title: 'Introduction to the Theory of Computation', author: 'Michael Sipser', pages: 504, isbn: '978-0-19-953556-9' },
                { id: '786f84ca-25a0-4b8d-a99b-d93c0084a357', title: 'Design Patterns: Elements of Reusable Object-Oriented Software', author: 'Erich Gamma, Richard Helm, Ralph Johnson, John Vlissides', pages: 395, isbn: '978-0-307-29136-8' }
            ];
            ddbMock.on(ScanCommand).resolves({ Items: books });

            const result = await listBooks();

            expect(ddbMock.calls()).toHaveLength(1);
            expect(result).toEqual({ statusCode: 200, body: JSON.stringify(books) });
        });

        test('should return 500 for DynamoDB error', async () => {
            ddbMock.on(ScanCommand).rejects(new Error('DynamoDB error'));

            const result = await listBooks();

            expect(ddbMock.calls()).toHaveLength(1);
            expect(result).toEqual({ statusCode: 500, body: JSON.stringify({ message: 'DynamoDB error' }) });
        });
    });

    describe('getBook', () => {
        test('should get a book successfully', async () => {
            const book = {
                id: 'bd26db56-9ff0-4c12-be67-710ce2ad1293',
                title: 'Clean Code',
                author: 'Robert C. Martin',
                pages: 464,
                isbn: '978-0-06-112008-4',
            };

            ddbMock.on(GetCommand).resolves({ Item: book });

            const result = await getBook(book.id);

            expect(ddbMock.calls()).toHaveLength(1);
            expect(result).toEqual({ statusCode: 200, body: JSON.stringify(book) });
        });

        test('should return 404 if book not found', async () => {
            ddbMock.on(GetCommand).resolves({});

            const result = await getBook('aa26db56-9ff0-4c12-be67-710ce2ad1293');

            expect(ddbMock.calls()).toHaveLength(1);
            expect(result).toEqual({ statusCode: 404, body: JSON.stringify({ message: 'Book not found' }) });
        });

        test('should return 500 for DynamoDB error', async () => {
            ddbMock.on(GetCommand).rejects(new Error('DynamoDB error'));

            const result = await getBook('bd26db56-9ff0-4c12-be67-710ce2ad1293');

            expect(ddbMock.calls()).toHaveLength(1);
            expect(result).toEqual({ statusCode: 500, body: JSON.stringify({ message: 'DynamoDB error' }) });
        });
    });

    describe('updateBook', () => {
        test('should update a book successfully', async () => {
            const bookUpdates = {
                title: 'Clean Code Revised',
                author: 'Robert C. Martin',
                pages: 500,
                isbn: '978-0-452-28423-4',
            };

            ddbMock.on(UpdateCommand).resolves({ Attributes: { ...bookUpdates, id: 'bd26db56-9ff0-4c12-be67-710ce2ad1293' } });

            const result = await updateBook('bd26db56-9ff0-4c12-be67-710ce2ad1293', bookUpdates);

            expect(ddbMock.calls()).toHaveLength(1);
            const call = ddbMock.calls()[0];
            expect(call.args[0].input).toEqual(expect.objectContaining({
                TableName: TABLE_NAME,
                Key: { id: 'bd26db56-9ff0-4c12-be67-710ce2ad1293' },
                UpdateExpression: expect.any(String),
                ExpressionAttributeValues: expect.any(Object),
                ReturnValues: 'ALL_NEW'
            }));
            expect(result.statusCode).toBe(200);
        });

        test('should return 400 for invalid data', async () => {
            const result = await updateBook('bd26db56-9ff0-4c12-be67-710ce2ad1293', {});

            expect(result).toEqual({ statusCode: 400, body: JSON.stringify({ message: 'Missing required fields for update' }) });
        });

        test('should return 500 for DynamoDB error', async () => {
            const bookUpdates = {
                title: 'Clean Code Revised',
                author: 'Robert C. Martin',
                pages: 500,
                isbn: '978-0-14-044913-6',
            };

            ddbMock.on(UpdateCommand).rejects(new Error('DynamoDB error'));

            const result = await updateBook('bd26db56-9ff0-4c12-be67-710ce2ad1293', bookUpdates);

            expect(ddbMock.calls()).toHaveLength(1);
            expect(result).toEqual({ statusCode: 500, body: JSON.stringify({ message: 'DynamoDB error' }) });
        });
    });

    describe('deleteBook', () => {
        test('should delete a book successfully', async () => {
            ddbMock.on(DeleteCommand).resolves({});

            const result = await deleteBook('bd26db56-9ff0-4c12-be67-710ce2ad1293');

            expect(ddbMock.calls()).toHaveLength(1);
            const call = ddbMock.calls()[0];
            expect(call.args[0].input).toEqual({
                TableName: TABLE_NAME,
                Key: { id: 'bd26db56-9ff0-4c12-be67-710ce2ad1293' }
            });
            expect(result).toEqual({ statusCode: 204 });
        });

        test('should return 500 for DynamoDB error', async () => {
            ddbMock.on(DeleteCommand).rejects(new Error('DynamoDB error'));

            const result = await deleteBook('bd26db56-9ff0-4c12-be67-710ce2ad1293');

            expect(ddbMock.calls()).toHaveLength(1);
            expect(result).toEqual({ statusCode: 500, body: JSON.stringify({ message: 'DynamoDB error' }) });
        });
    });
});