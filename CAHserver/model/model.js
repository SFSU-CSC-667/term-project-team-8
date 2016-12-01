// function that takes in a database to query and returns the result
function getData(db)
{
  const result = new Object();
  db.any('SELECT * FROM items')
   .then(function (data)
   {
     // res.set('data', data);
       result.data =  data;
   })
   .catch(function (error)
    {
      result.data = error;
    }); //function that takes in the error
    return result;
}

function example()
{
  const obj = new Object();
  obj.x = 'a';
  return obj;
}

module.exports.getData = getData;
module.exports.example = example;
