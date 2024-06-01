const errorHandler = (err, req, res) => {
    if (res.statusCode === 500) {
        console.error(err.stack);
    }

    res.status(err.status || 500);
    res.json({
        error: {
            message: err.message || 'An unknown error occurred.',
            status: err.status || 500,
            stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
        }
    });
};

export default errorHandler;
