const jwt=require('jsonwebtoken');
const secret=process.env.JWT_SECRET

function createToken(user) {
    try {
        const payload = { id: user._id, email: user.email };

        return token=jwt.sign(payload, secret, { expiresIn: '7d' });
    } catch (error) {
        console.error("Error creating token:", error);
    }
}

function validate(token) {
    try {
        return jwt.verify(token, secret);
    }
    catch (error) {
        console.error("Error validating token:", error);
        throw new Error("Invalid token");
    }
}

module.exports={createToken,validate};