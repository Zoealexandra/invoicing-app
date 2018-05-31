const express = require('express')
const bodyParser = require('body-parser')
const sqlite3 = require('sqlite3').verbose()
const bcrypt = require('bcrypt')
const multipart = require("connect-multiparty")
const saltRounds = 10
const PORT = process.env.PORT || 3128

const server = express()
server.use(bodyParser.urlencoded({extended: false}))
server.use(bodyParser.json())

//Multiparty middleware
const multipartMiddleware = multipart();

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
        let user_id = this.lastID
        return res.json({
          status: true,
          message: 'User Created'
        })
      }
    })
    db.close()
  })
})

//logging in to the application
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

//Adding a new invoice
/* server.post('/invoice', multipartMiddleware, (req, res) => {
  if (isEmpty(req.body.name)) {
    return res.json({
      status:false,
      message: 'Invoice needs a name'
    })
  }
  let db = new sqlite3.Database('./database/InvoicingApp.db')
  let sql = `INSERT INTO invoices(name,user_id,paid) VALUES (
    '${req.body.name}',
    '${req.body.user_id}',
    '0'
  )`
  db.serialize(function () {
    db.run(sql, function (err) {
      if (err) {
        return res.json({
          status: false,
          message: 'Sorry, there was an error creating your invoice :('
        })
      }
      console.log(this)
      console.log(this.lastID)
      let invoice_id = this.lastID
      for (let i = 0; i < req.body.txn_names.length; i++) {
        let query = `INSERT INTO transactions(name,price,invoice_id) VALUES(
         '${req.body.txn_names[i]} ',
         '${req.body.txn_prices[i]}',
         '${invoice_id}'
        )`
        db.run(query)
      }
      return res.json({
        status: true,
        message: 'Invoice created'
      })
    })
  })
}) */

app.post("/invoice", multipartMiddleware, function(req, res) {
  // validate data
  if (isEmpty(req.body.name)) {
    return res.json({
      status: false,
      message: "Invoice needs a name"
    })
  }

  // perform other checks
  // create invoice
  let db = new sqlite3.Database("./database/InvoicingApp.db");
  let sql = `INSERT INTO invoices(name,user_id,paid) VALUES('${
    req.body.name
  }','${req.body.user_id}','0')`;
  
  db.serialize(function() {
    db.run(sql, function(err) {
      if (err) {
        return res.json({
          status: false,
          message: "Sorry, there was an error creating your invoice :("
        });
      }

      let invoice_id = this.lastID;
      for (let i = 0; i < txn_names.length; i++) {
        let query = `INSERT INTO transactions(name,price,invoice_id) VALUES(
            '${txn_names[i]}',
            '${txn_prices[i]}',
            '${invoice_id}'
        )`
        db.run(query, function(err) {
          if (err) {
            error = TRUE;
            return res.json({
              status: false,
              message: "Sorry, there was an error creating your invoice :("
            })
          } 
        })
      }
      return res.json({
        status: true,
        message: "Invoice created"
      })
    })
  })
})

// search transactions by user
server.get('/invoice/user/:user_id', multipartMiddleware, (req, res) => {
  let db = new sqlite3.Database('./database/InvoicingApp.db')
  let sql = `SELECT * FROM invoices LEFT JOIN transactions ON invoices.id=transactions.invoice_id WHERE user_id='${req.params.user_id}'`
  db.all(sql, [], (err, rows) => {
    if (err) {
      throw err
    }
    return res.json({
      status: true,
      transactions: rows
    })
  })
})

server.get('/invoice/user/:user_id/:invoice_id', multipartMiddleware, function(req, res){
  let db =  new sqlite3.Database('./database/InvoicingApp.db')
  let sql = `SELECT * FROM invoices LEFT JOIN tranactions ON 
  invoices.id=transactions.invoice_id WHERE user_id=${req.params.user_id}' AND invoice_id=${req.params.invoice_id}'`
  db.all(sql, [], (err, rows) => {
    if (err) {
      throw err
    }
    return res.json({
      status:true,
      transactions: rows
    })
  })
})

