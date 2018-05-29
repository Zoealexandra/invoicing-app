const express = require('express')
const bodyParser = require('body-parser')
const sqlite3 = require('sqlite3').verbose()
const bcrypt = require('bcrypt')
const saltRounds = 10
const PORT = process.env.PORT || 3128

const server = express()
server.use(bodyParser.urlencoded({extended: false}))
server.use(bodyParser.json())

server.get('/', (req, res) => {
  res.send('Invoicing App')
})

server.listen(PORT, () =>
// eslint-disable-next-line no-console
  console.log(`App running on localhost:${PORT}`)
)

function isEmpty(str) {
  return !str || 0 === str.length;
}

server.post('/register', (req,res) => {
  //ensure no empty fields
  if(!(req.body.name) || !(req.body.email) || !(req.body.company_name) || !(req.body.password)) {
    return res.json({
      'status': false,
      'message': 'All fields are required'
    })
  }
  bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
    let db = new sqlite3.Database('./database/invoicingApp.db')
    let sql = `INSERT INTO users(name,email,company_name,password) VALUES('${
      req.body.name
    }','${req.body.email}','${req.body.company_name}','${hash}')`
    db.run(sql, err => {
      if (err) {
        throw err
      } else {
        return res.json({
          status: true,
          message: 'User Created'
        })
      }
    })
    db.close()
  })
})

server.post('/login', (req, res) => {
  let db = new sqlite3.Database('./database/InvoicingApp.db')
  let sql = `SELECT * from users where email='${req.body.email}'`
  db.all(sql, [], (err, rows) => {
    if (err) {
      throw err
    }
    db.close()
    if (rows.length == 0) {
      return res.json({
        status: false,
        message: 'Sorry, wrong email'
      })
    }
    let user = rows[0]
    let authenticated = bcrypt.compareSync(req.body.password, user.password)
    delete user.password
    if (authenticated) {
      return res.json({
        status:true,
        user
      })
    }
    return res.json({
      status: false,
      message: 'Wrong Password, please retry'
    })
  })
})