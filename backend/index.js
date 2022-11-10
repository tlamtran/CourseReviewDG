const express = require("express");
const axios = require("axios");
const app = express();
const cors = require("cors");
// const pool = require("./db");
const client = require("./db")
const pg = require('pg');

// middleware
app.use(cors());
app.use(express.json()); //req.body



client.connect(function(err) {
  if(err) {
    return console.error('could not connect to postgres', err);
  }
  client.query('SELECT NOW() AS "theTime"', function(err, result) {
    if(err) {
      return console.error('error running query', err);
    }
    console.log("connected to database");

  });
});








//ROUTES//

// POST REVIEWS

app.post('/reviews', async (req, res) => {
    try {

        const { review } = req.body;
        await client.query(
          'INSERT INTO reviews (review) VALUES($1)', [review], (err, result) => {

        if (!err) {
          res.json("Review was added");
          console.log("Successfully added data");
        } else {
          console.log(err.message)
        }
        client.end;
      });

    } catch (err) {
        console.error(err.message);
    }
});


// GET REVIEWS

app.get('/reviews', async (req, res) => {
  try {

    await client.query('SELECT * FROM reviews', (err, result) => {

    if (!err) {
        const resultRows = result.rows;
        res.json(resultRows);
        console.log("Successfully fetched data");
    } else {
        console.log(err.message)
    }
    client.end;
    });


  } catch (err) {
    console.error(err.message);
  }
});




app.get('/reviews/:id', async (req, res) => {
  try {
    const {id} = req.params;
    await client.query('SELECT * FROM reviews WHERE reviewer_id = $1', [id], (err, result) => {

    if (!err) {
      res.json(result.rows[0]);
      console.log("Successfully fetched data");
    } else {
      console.log(err.message)
    }
    client.end;
    });

  } catch (err) {
    console.error(err.message);
  }
});




const baseUrl =
  "https://course.api.aalto.fi/api/sisu/v1/courseunitrealisations?code=CS&limit=30&user_key=f0a4cddc2453b213a23b5046572bf415";

app.get('/courses', async (request, response) => {
  try {
    const { data } = await axios.get(baseUrl);
    response.status(200).send(data);
  } catch(ex) {
    response.status(500).send(ex.data);
  }
})


// UPDATE REVIEW

app.put("/reviews/:id", async (req, res) => {
  try {
    const {id} = req.params;
    const {review} = req.body;
    await client.query("UPDATE reviews SET review=$1 WHERE reviewer_id=$2", [review, id], (err, response) => {
      
      if (!err) {
        res.json("Review was updated");
        console.log("Successfully updated review");
      } else {
        console.log(err.message)
      }

    });
  
    
  } catch (err) {
    console.error(err.message)
  }
});


// DELETE REVIEW

app.delete("/reviews/:id", async (req, res) => {
  try {
    const {id} = req.params;
    const deleteReview = await client.query(
      "DELETE FROM reviews WHERE reviewer_id = $1", [id], (err, response) => {

      if (!err) {
        res.json("Review was deleted");
        console.log("Successfully deleted review");
      } else {
        console.log(err.message)
      }
      client.end;
      });
  
    
  } catch (err) {
    console.log(err.message)
  }
});






const PORT = 3001
app.listen(PORT, () => {
    console.log(`server has started on port ${PORT}`)
})