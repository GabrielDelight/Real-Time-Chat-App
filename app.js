const express = require('express');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');
const hbs = require('hbs')

const port = process.env.PORT || 3000

const app = express();
app.use(express.static(path.join(__dirname, '/public')))

app.set('view engine', 'hbs')

const viewsPath = path.join(__dirname, '/views/partials');
hbs.registerPartials(viewsPath)


app.get('', (req, res) => {
    res.render('index')
})


const server = http.createServer(app)
const io = socketio(server)

let usersArray = []

io.on('connection', (socket) => {
    socket.emit('welcomeText', 'Welcome to chat')


    // get names
    socket.on('users', (name) => {
        usersArray.push(name)
        if(usersArray.length > 20){
            usersArray.shift()
        }
        io.emit('getNames', usersArray)
    })


    socket.on('sendName', (name) => {
        socket.broadcast.emit('newUserText', `${name} Joined the group`)
    })


    // Recieve chat
    socket.on('sendMessage', (msg) => {
        socket.broadcast.emit('showMessage', msg)
        
    })

    // File upload


    // On discoconecton
    socket.on('disconnect', () => {
        console.log('User left')
        io.emit('userleft', 'User has left the group ')
    })


})

server.listen(port, () => {
    console.log("Server is up and running")
})



