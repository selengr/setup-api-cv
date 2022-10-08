const validate = (schema) => async (req, res, next) => {
    try {
        await schema.validate({
            body: req.body,
            query: req.query,
            params: req.params,
        }, {
            abortEarly : false
        });
        return next();
    } catch (err) {
        let allErrors = {}
        err.inner.forEach( err => {
            let path = err.path.replace(/body\.|query\.|params\./i , '')
            allErrors[path] = err.message.replace(/body\.|query\.|params\./i , '')
        })

        return res.status(422).json({ 
            type: err.name,
            errors: allErrors
        });
    }
};

module.exports = validate;