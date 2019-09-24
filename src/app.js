require ('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const {NODE_ENV} = require('./config')
const uuid = require('uuid/v4')
const winston = require('winston')

const app = express();

const morganOption = (NODE_ENV === 'production') ? 'tiny': 'common';

app.use(morgan(morganOption));
app.use(helmet());
app.use(cors())
app.use(express.json())

//create a bookmarks array
const bookmarks = [
  { 
    id: 0,
    title: 'Google',
    url: 'http://www.google.com',
    rating: '3',
    desc: 'Internet-related services and products.'
  }
]

//middleware , validates authorization header
app.use(function validateBearerToken(req, res, next) {
  const apiToken = process.env.API_TOKEN;
  const authToken = req.get('Authorization')

console.log(`this is the apiToken from .env ${apiToken}`);
console.log(`this is the get authorization from postman ${authToken}`)

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
      new winston.transports.File({ filename: 'info.log' })
    ]
  });

  if(!authToken || authToken.split(' ')[1] !== apiToken) {
    logger.error(`Unauthorized request to join path ${req.path}`)
    return res.status(401).json({error: 'Unauthorized request'})
  }
  next();
})

app.get('/bookmarks', (req, res) => {
    res
      .json(bookmarks)
})

//post a new bookmark in the array
app.post('/bookmarks', (req, res) => {
  const {title, url, rating, desc} = req.body;

  //Validation required for the values of bookmarks, title url, rating, desc
  if(!title) {
    
    //  logger.error(`TItle is required`)
     return res
      .status(400) 
      .send('Title is required')
  }

  if(!url) {
    //  logger.error(`Url is required`)
     return res 
      .status(400)
      .send('Url is required')
  }

  if(!rating) {
    
      logger.error(`Rating is required`)
      return res
      .status(400)
      .send('Rating is required')
  }

  if(!desc) {
    
      // logger.error(`desc is required`)
      return res
      .status(400)
      .send('desc is required')
  }


  //generate id if all the other property validation passes
  const id = uuid();

  const bookmark = {
    id,
    title,
    url,
    rating,
    desc
  }
  
  bookmarks.push(bookmark);

  // logger.info(`Card with id ${id} was created`)

  res
    .status(201)
    .location(`http://localhost:8000/bookmarks/${id}`)
    .json(bookmark)
})

app.get('/bookmarks/:id', (req, res) => {
  const {id} = req.params;

  //match id from request to bookmarks database
  const bookmark = bookmarks.find(b => b.id == id)

  //validation 
  if(!card) {
    // logger.error(`Card with id ${id} not found`)
   return res
      .status(404)
      .send('card not found')
  }
  //display the card if validation passed
  res.json(card);
    
})

app.delete('/bookmarks/:id', (req, res) => {
  //to delete an id use methods,findIndex() first & splice() the index 
  const {id} = req.params;

  //get match id from req to database 
  const bookmarkIndex = bookmarks.findIndex(c => {
    c.id == id
  });

  //validate
  if(!bookmarkIndex) {
    // logger.error(`bookmark for id ${id} not found`)
    return res
      .status(404)
      .send('Not found')
  }

//deleting the index of the matched id in bookmarkIndex
bookmarks.splice(bookmarkIndex, 1);
  
//response, no response sent back
res
  .status(204)
  .end()
})

app.use(function errorHandler(error, req, res, next) {
       let response
       if (NODE_ENV === 'production') {
         response = { error: { message: 'server error' } }
       } else {
         console.error(error)
         response = { message: error.message, error }
       }
       res.status(500).json(response)
     })
module.exports = app;