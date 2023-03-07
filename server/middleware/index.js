import * as dotenv from 'dotenv'

const allowedOrigins = process.env.ENV ? ['http://localhost:5173'] : [process.env.API_URL];

export function checkOrigin(req, res, next) {
    // Get the origin header of the request
    var origin = req.headers.origin;
    // If the origin header is not present, assume it is the same as the host header
    if (!origin) {
        origin = req.protocol + '://' + req.headers.host;
    }
    // Check if the origin is in the allowed origins array
    if (allowedOrigins.indexOf(origin) > -1) {
        // If yes, call the next middleware function
        next();
    } else {
        // If no, send a 403 forbidden response
        res.status(403).send('Access denied. Origin not allowed.');
    }
}