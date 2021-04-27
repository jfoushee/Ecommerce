"use strict";
 
var app = require("./app.js");
 
require("greenlock-express")
    .init({
        // where to find .greenlockrc and set default paths
        packageRoot: __dirname,
        
        manager: {
            "module": "@greenlock/manager"
        },
        // where config and certificate stuff go
        configDir: "./greenlock.d",

        // contact for security and critical bug notices
        maintainerEmail: 'jacobfoushee@gmail.com',

        // name & version for ACME client user agent
        //packageAgent: pkg.name + "/" + pkg.version,

        // whether or not to run at cloudscale
        cluster: false
    })
    .serve(app);