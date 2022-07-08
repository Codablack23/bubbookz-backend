const routes ={
    book_store:require("../book-store/routes"),
    communities:require("../communities/routes"),
    user:require("../user/routes"),
    events:require("../events/routes"),
    admin:require("../admin/routes"),
}

const services ={
    auth:require('../services/auth'),
    payments:require("../services/payment"),
    store:require("../services/store")
}

module.exports ={
    routes,
    services,
    database:require('./db')
}