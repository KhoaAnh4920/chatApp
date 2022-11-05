const validator = require('../shared/helpers/validate');

const signup = async(req, res, next) => {


    const validationRule = {
        "email": "required|email",
        "userName": "required|string",
        "phoneNumber": "required|string",
        "password": "required|string|min:6|strict",
    }

    await validator(req.body, validationRule, {}, (err, status) => {
        if (!status) {
            res.status(412)
                .send({
                    success: false,
                    message: 'Validation failed',
                    data: err
                });
        } else {
            next();
        }
    }).catch(err => console.log(err))
}

const changePassword = async(req, res, next) => {


    const validationRule = {
        "oldPassword": "required|string|min:6|strict",
        "password": "required|string|min:6|strict",
    }

    await validator(req.body, validationRule, {}, (err, status) => {
        if (!status) {
            res.status(412)
                .send({
                    success: false,
                    message: 'Validation failed',
                    data: err
                });
        } else {
            next();
        }
    }).catch(err => console.log(err))
}

module.exports = {
    signup,
    changePassword
};