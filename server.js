const express = require('express')
const bodyParser = require('body-parser')
const sqlite3 = require('sqlite3').verbose()
const PORT = process.env.PORT || 3128

const server = express()
server.use(bodyParser.urlencoded({extended: false}))
server.use(bodyParser.json())

server.get('/', (req, res) => {
  res.send('Invoicing App')
})

server.listen(PORT, ()=>
console.log(`App running on localhost:${PORT}`))

