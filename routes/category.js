const express = require('express');
const router = express.Router();
const category = require('./../models/category')


router.post('/add-category',(req,res)=>{
    category.create({
        category_name:req.body.category_name,
      },(err)=>{
          res.send(err)
      })
})

module.exports = router;