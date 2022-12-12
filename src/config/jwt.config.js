import jwt from 'jsonwebtoken'

const generateToken = (user) => {

    const { _id, name, email, isAdmin } = user

    const signature = process.env.TOKEN_SIGN_SECRET
    const expiration = "12h"

    return jwt.sign(
        { _id, name, email, isAdmin }, signature, {
            expiresIn: expiration
        }
    )
}

export default generateToken