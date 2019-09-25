const express = require('express')
const bookmarks = require('../bookmarksData')
const uuid = require('uuid/v4')
const logger = require('./logger')

const bookmarksRouter = express.Router();
const bodyParser = express.json();

bookmarksRouter
    .route('/bookmarks')
    .get((req, res) => {
    res
      .json(bookmarks)
    })
    .post(bodyParser, (req, res) => {
        const {title, url, rating, desc} = req.body;
         //Validation required for the values of bookmarks, title url, rating, desc
         if(!title) {
    
            //   logger.error(`TItle is required`)
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
            
            //logger.error(`Rating is required`)
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

    bookmarksRouter
    .route('/bookmarks/:id')
    .get((req, res) => {
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
    .delete(bodyParser, (req, res) => {
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

module.exports =  bookmarksRouter


   
//steps to DELETE  
//1. set the value of id entered by user const {id}
//2. get the value of id (findIndex)
//3. validate if id matches id in array & send error response (400)
//4. delete the matching id (splice)
//5. log response (logger.info)(status 204)




  