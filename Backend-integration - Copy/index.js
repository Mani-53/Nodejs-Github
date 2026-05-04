var express = require("express")
var fs = require('fs')
var cors = require("cors")
var jwt = require("jsonwebtoken")
var bodyparser = require("body-parser")
var app = express()

app.use(bodyparser.urlencoded({ extended: false }))
app.use(bodyparser.json())
app.use(cors())

app.get("/", (req, res) => {
    res.send("request ochindi")
})

var arr = []
app.post("/login", (req, res) => {
    var users = JSON.parse(fs.readFileSync("users.txt").toString())
    var user = users.find((u) => {
        if (u.username == req.body.username && u.password == req.body.password) {
            return true
        }
    })
    if (user) {
        var token = jwt.sign({
            username: req.body.username
        }, "secret")
        res.send({
            msg: "Login successfull...",
            token: token
        })
    }
    else {
        res.send("There is no user for matching the given credentials")
    }

})

var ntd = []
app.post("/todos", (req, res) => {
    var newtodo = req.body
    var data = JSON.parse(fs.readFileSync("todos.txt").toString())
    if (data) {
        ntd = data
    }
    ntd.push(newtodo)
    fs.writeFileSync("todos.txt", JSON.stringify(ntd))
    console.log(ntd)
    // res.send(ntd)
})

app.get("/todos", (req, res) => {
    var todos = JSON.parse(fs.readFileSync("todos.txt").toString())

    console.log(todos)
    res.send(todos)
})


app.delete("/todos/:id", (req, res) => {
    var todos = JSON.parse(fs.readFileSync("todos.txt").toString())
    var id = Number(req.params.id)
    todos = todos.filter((item) => item.id !== id)
    fs.writeFileSync("todos.txt", JSON.stringify(todos))
})


app.listen(process.env.PORT || 1000, function (req, res) {
    console.log("server is running on " + (process.env.PORT || 1000))
})