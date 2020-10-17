const loggerMiddleware = (req, resp, next) => {

    console.log('Request logged:', req.method, req.path);
    next()
};

export default loggerMiddleware
