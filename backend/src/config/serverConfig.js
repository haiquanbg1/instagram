const express = require("express");

module.exports = (app) => {
    // config req.body
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
}