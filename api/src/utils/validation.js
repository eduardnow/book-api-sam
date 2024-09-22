const validateBookData = (data) => {
    if (!data.id || !data.title || !data.author || !data.pages || !data.isbn) {
        return 'Missing required field(s): id, title, author, pages, or isbn';
    }
    if (typeof data.pages !== 'number' || data.pages <= 0) {
        return 'Pages must be a positive number';
    }
    return null;
};

module.exports = { validateBookData };
