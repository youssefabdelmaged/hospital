const express = require('express')
const  dotenv = require('dotenv');
const morgan=require('morgan');
dotenv.config({path:"config.env"})
const dbconection=require("./config/database");
const path = require('path')

dbconection();
const app = express()

if(process.env.NODE_ENV =="development"){
    app.use(morgan('dev'));
    console.log(`node: ${process.env.NODE_ENV}`);
}
 const cors=require("cors");
const compression =require("compression") 

 
app.use(cors()) // Use this after the variable declaration

app.use((req,res,next)=>
{
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'OPTIONS, GET, POST, PUT, PATCH, DELETE'
  );
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next()
})

const webhook = require('./controllers/reservations')
app.post('/webhook-check-out', express.raw({type: 'application/json'}),webhook.webhookCheckOut)


app.use(express.json())

const auth = require('./routes/auth')
const users = require('./routes/users')
const doctor = require('./routes/Doctor')
const doctorCalender = require('./routes/doctorCalender')
const admin = require('./routes/admin')
const reviews = require('./routes/reviews')
const home = require('./routes/home');
const reservations = require('./routes/reservations')
const contactus = require('./routes/contactus')
const Notes = require('./routes/notes')

app.use('/auth',auth);
app.use('/user',users)
app.use('/admin',admin)
app.use('/doctor',doctor)
app.use('/calender',doctorCalender)
app.use(reviews)
app.use('/home',home)
app.use(reservations)
app.use(contactus)
app.use(Notes)


app.use(express.static(path.join(__dirname,'uploads'))) // to serve images

app.use(compression())

const port=process.env.PORT

app.listen(port,()=>{
console.log(`app working of port ${port}`)
})
