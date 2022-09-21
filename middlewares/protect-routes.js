function protectRoutes(req, res, next) {
    // check if is authenticated
    if (!res.locals.isAuth) {
        return res.redirect('/401');
    }

    // check if is authorized
    // startsWith() is a buildin method which is used on string 
    if (req.path.startsWith('/admin') && !res.locals.isAdmin) {
        return res.redirect('/403');
    }
    
    next();

}

module.exports = protectRoutes;