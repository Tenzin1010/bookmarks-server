const express = require('express')
const logger = require('../logger')

const validateBookmarkCreation = (req, res, next) => {
    const {title, url, rating, desc} = req.body;
  
    if(!title) {
      
      logger.error(`TItle is required`)
       return res
        .status(400) 
        .send('part of .status Message: Title is required')
    }
  
    if(!url) {
      logger.error(`Url is required`)
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
        logger.error(`desc is required`)
        return res
        .status(400)
        .send('desc is required')
    }
    next();
  }



  module.exports = validateBookmarkCreation