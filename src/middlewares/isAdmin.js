function isAdmin(req, res, next) {

    if (!req.auth['isAdmin']) {
        return res.status(401).json({msg: "Usuário não autorizado para esta rota!"})
    }
    next()
}

export default isAdmin