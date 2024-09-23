const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, PutCommand, ScanCommand, GetCommand, UpdateCommand, DeleteCommand } = require('@aws-sdk/lib-dynamodb');
const { createResponse } = require('../utils/response');
const { validateBookData } = require('../utils/validation');

const TABLE_NAME = process.env.TABLE_NAME;
const REGION = process.env.MY_AWS_REGION;

// Configure the DynamoDB client
const ddbClient = new DynamoDBClient({ region: REGION });
const ddbDocClient = DynamoDBDocumentClient.from(ddbClient);

const createBook = async (book) => {
    const error = validateBookData(book);
    if (error) {
        return createResponse(400, { message: error });
    }

    const params = new PutCommand({
        TableName: TABLE_NAME,
        Item: book,
    });

    try {
        await ddbDocClient.send(params);
        return createResponse(201, book);
    } catch (error) {
        console.error('Error creating book:', error);
        return createResponse(500, { message: error.message });
    }
};

const listBooks = async () => {
    const params = new ScanCommand({
        TableName: TABLE_NAME,
    });

    try {
        const result = await ddbDocClient.send(params);
        return createResponse(200, result.Items);
    } catch (error) {
        console.error('Error listing books:', error);
        return createResponse(500, { message: error.message });
    }
};

const getBook = async (id) => {
    const params = new GetCommand({
        TableName: TABLE_NAME,
        Key: { id },
    });

    try {
        const result = await ddbDocClient.send(params);
        if (result.Item) {
            return createResponse(200, result.Item);
        } else {
            return createResponse(404, { message: 'Book not found' });
        }
    } catch (error) {
        console.error('Error getting book:', error);
        return createResponse(500, { message: error.message });
    }
};

const updateBook = async (id, data) => {
    const requiredFields = ['title', 'author', 'pages', 'isbn'];
    const missingFields = requiredFields.filter(field => !data[field]);
    if (missingFields.length) {
        return createResponse(400, { message: 'Missing required fields for update' });
    }

    const params = new UpdateCommand({
        TableName: TABLE_NAME,
        Key: { id },
        UpdateExpression: 'set #title = :title, #author = :author, #pages = :pages, #isbn = :isbn',
        ExpressionAttributeNames: { '#title': 'title', '#author': 'author', '#pages': 'pages', '#isbn': 'isbn' },
        ExpressionAttributeValues: { ':title': data.title, ':author': data.author, ':pages': data.pages, ':isbn': data.isbn },
        ReturnValues: 'ALL_NEW',
    });

    try {
        const result = await ddbDocClient.send(params);
        return createResponse(200, result.Attributes);
    } catch (error) {
        console.error('Error updating book:', error);
        return createResponse(500, { message: error.message });
    }
};

const deleteBook = async (id) => {
    const params = new DeleteCommand({
        TableName: TABLE_NAME,
        Key: { id },
    });

    try {
        await ddbDocClient.send(params);
        return createResponse(204);
    } catch (error) {
        console.error('Error deleting book:', error);
        return createResponse(500, { message: error.message });
    }
};

module.exports = {
    createBook,
    listBooks,
    getBook,
    updateBook,
    deleteBook
};