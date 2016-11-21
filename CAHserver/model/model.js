const connect = require('../core/connect.js');

function getData(req,res)
{
  connect.db.any('SELECT * FROM items')
   .then(function (data)
   {
      res.send(data);
   })
   .catch(function (error)
    {
      res.send(error);
    }); //function that takes in the error
}

module.exports.getData = getData;
