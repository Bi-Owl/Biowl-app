const jwt = require('jsonwebtoken');
const UserExamAttempt = require('../models/userExamAttempt');

const examAuthMiddleware = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from header
            token = req.headers.authorization.split(' ')[1];

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Check if the decoded token has the attemptId
            if (!decoded.attemptId) {
                return res.status(401).json({ message: 'Not authorized, invalid exam token.' });
            }

            // Get attempt from the token
            const attempt = await UserExamAttempt.findByPk(decoded.attemptId);

            if (!attempt) {
                return res.status(404).json({ message: 'Exam attempt not found.' });
            }

            // Check if the user ID in the token matches the user associated with the attempt
            // This also uses the user ID from the general 'protect' middleware that should run before this.
            if (attempt.UserId !== req.user.id) {
                return res.status(401).json({ message: 'Not authorized to access this attempt.' });
            }
            
            // Attach the attempt object to the request for use in the controller
            req.attempt = attempt;

            next();
        } catch (error) {
            console.error('Exam token verification failed:', error);
            if (error.name === 'TokenExpiredError') {
                // Automatically mark the exam as timed out if the token is expired
                try {
                    const expiredDecoded = jwt.decode(token);
                    if (expiredDecoded && expiredDecoded.attemptId) {
                        const attempt = await UserExamAttempt.findByPk(expiredDecoded.attemptId);
                        if (attempt && attempt.status !== 'completed') {
                            attempt.status = 'completed';
                            attempt.finishedAt = new Date();
                            await attempt.save();
                            console.log(`Attempt ${attempt.id} marked as completed due to token expiration.`);
                        }
                    }
                } catch (saveError) {
                    console.error('Error updating attempt status on token expiration:', saveError);
                }
                return res.status(401).json({ message: 'Exam time has expired.' });
            }
            res.status(401).json({ message: 'Not authorized, token failed.' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no exam token.' });
    }
};

module.exports = examAuthMiddleware;
