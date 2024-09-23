const validateBookData = (data) => {
    const requiredFields = ['id', 'title', 'author', 'pages', 'isbn'];
    const missingFields = requiredFields.filter(field => !data[field]);
    if (missingFields.length) {
        return `Missing required field(s): ${missingFields.join(', ')}`;
    }
    if (typeof data.pages !== 'number' || data.pages <= 0) {
        return 'Pages must be a positive number';
    }
    if (typeof data.isbn !== 'string' || !/^\d{3}-\d{1,5}-\d{1,7}-\d{1,7}-\d{1}$/.test(data.isbn)) {
        return 'Invalid ISBN format';
    }
    return null;
};

module.exports = {validateBookData};
