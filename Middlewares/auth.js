const { response } = require('express');
const jwt = require('jsonwebtoken')
var fs = require('fs');

var privateKey = fs.readFileSync('./keys/private.key');
var publicKey = fs.readFileSync('./keys/public.key.pub');

module.exports.givetoken = function(id, username, grade, admin, section) {

    const usertoken = jwt.sign({
        id: id,
        username: username,
        grade: grade,
        section: section,
        admin: admin,
        exp: Math.floor(Date.now() / 1000) + 18000
    },  privateKey, { algorithm: 'RS256' })
    return(usertoken)
}

module.exports.validateadmin = function(req, res, next) {
    const decodedToken = jwt.verify(token, publicKey, { algorithm: 'RS256' })
    if(decodedToken.admin == 1)
    {
        next()
    }
    else
    {
        return res.status(401).send({
            message: 'Not Authorized!',
            status: false
        })
    }
}

 module.exports.decodetoken = function() {
    return(jwt.verify(token, publicKey, { algorithm: 'RS256' }))
 }


module.exports.checklogin = function(req, res, next) {
    try {

        if(req.cookies.jwt)
        {
            token = req.cookies.jwt
        }
        else
        {
            if(req.headers.authorization)
            {
                token = req.headers.authorization.split(" ")[1]
            }
            else
            {
                return next();
            }
        } 
        const decodedToken = jwt.verify(token, publicKey, { algorithm: 'RS256' })
        if(decodedToken.admin == 1)
        {
            res.redirect('/admin/dashboard')
            return;
        }
        else if(decodedToken.admin == 0)
        {
            res.redirect('/exam/mainexam')
            return;
        }
        next();
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.redirect('/api/do-logout')
        } else if (error.name === "JsonWebTokenError") {
            return res.redirect('/api/do-logout')
        } else {
            return res.redirect('/api/do-logout')
        }
    }

}

module.exports.validateapiauthorization = function(req, res, next) {
    try {
            if(req.headers.authorization)
            {
                token = req.headers.authorization.split(" ")[1]
            }
            else
            {
                return res.status(401).send({
                    message: 'Token bulunamadı!',
                    status: false
                })
            }
        const decodedToken = jwt.verify(token, publicKey, { algorithm: 'RS256' })
        next();
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).send({
                message: 'Token Süresi Dolmuş',
                status: false
            })
        } else if (error.name === "JsonWebTokenError") {
            return res.status(401).send({
                message: 'Geçersiz Token veya İmza',
                status: false
            })
        } else {
            return res.status(401).send({
                message: 'Yetkisiz Erişim',
                status: false
            })
        }
    }

}

module.exports.validateauthorization = function(req, res, next) {
    try {

        if(req.cookies.jwt)
        {
            token = req.cookies.jwt
        }
        else
        {
            if(req.headers.authorization)
            {
                token = req.headers.authorization.split(" ")[1]
            }
            else
            {
                return res.status(401).send({
                    message: 'Token bulunamadı!',
                    status: false
                })
            }
        } 
        const decodedToken = jwt.verify(token, publicKey, { algorithm: 'RS256' })
        next();
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).send({
                message: 'Token Süresi Dolmuş',
                status: false
            })
        } else if (error.name === "JsonWebTokenError") {
            return res.status(401).send({
                message: 'Geçersiz Token veya İmza',
                status: false
            })
        } else {
            return res.status(401).send({
                message: 'Yetkisiz Erişim',
                status: false
            })
        }
    }

}
