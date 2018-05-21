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

const bcrypt = require('bcrypt')
const saltRounds = 10

server.post('/register', function(req, res) {
  //checks no empty fields
  if (isEmpty(req.body.name) || isEmpty(req.body.email) || isEmpty(req.body.company_name) || isEmpty(req.body.password)) {
    return res.json({
      'status': false,
      'message': 'All fields are required'
    })
  }
//any other intended checks
  bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
    let db = new sqlite3.Database("./database/InvoicingApp.db")
    let sql = `INSERT INTO users(name,email,company_name,password) VALUES('${
      req.body.name
    }','${req.body.email}','${req.body.company_name}','${hash}')`
    db.run(sql, function(err) {
      if (err)
        {
          throw err
        }  else {
          return res.json({
            status: true,
            message: "user created"
          })
        }
    })
    db.close()
  })
})

server.listen(PORT, () =>
// eslint-disable-next-line no-console
  console.log(`App running on localhost:${PORT}`)
)


