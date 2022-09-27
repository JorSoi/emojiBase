
//Importing Node Dependencies
const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');
const PORT = process.env.port || 3000;
const pool = require('./emojidb');

//Applying Middleware
app.use(cors(), morgan('tiny'));
app.use(bodyParser.json());
  
app.get('/emojis', async (req, res) => {
    try {
        const db_res = await pool.query("SELECT * FROM emojis ORDER BY id");
        res.status(200).send(db_res.rows)
    } catch(err) {
        console.log(`GET was not successfull: ${err}`)
    }
}); 

app.get('/emojis/:name', async (req, res) => {
    try {
        const db_res = await pool.query("SELECT * FROM emojis WHERE emoji_desc ILIKE $1 OR emoji_face = $1 ORDER BY id", ['%' + req.params.name + '%']);
        res.status(200).send(db_res.rows);
    } catch (err) {
        console.log(`GET param was not successfull: ${err}`);
    }
});

app.get('/emojis/edit/:id', async (req, res) => {
    try {
        const db_res = await pool.query("SELECT * FROM emojis WHERE id = $1", [req.params.id]);
        res.status(200).send(db_res.rows);
    } catch (err) {
        console.log(`GET param was not successfull: ${err}`);
    }
});

app.put('/emojis/edit/:id', async (req, res) => {
    try {
        const db_res = await pool.query("UPDATE emojis SET emoji_desc = $1, emoji_face = $2 WHERE id = $3", [req.body.emoji_desc, req.body.emoji_face, req.params.id]);
        res.sendStatus(204);
    } catch (err) {
        console.log(`PUT param was not successfull: ${err}`);
    }
})

app.post('/emojis', async (req, res) => {
    try {
        await pool.query("INSERT INTO emojis VALUES (DEFAULT, $1, $2)", [req.body.emoji_desc, req.body.emoji_face]);
        res.sendStatus(204);
    } catch (err) {
        console.log(`POST was not successfull: ${err}`);
    }
})


app.delete('/emojis/:id', async (req, res) => {
    console.log(req.params.id);
    try {
        await pool.query("DELETE FROM emojis WHERE id = $1", [req.params.id]);
        res.sendStatus(200);
    } catch (err) {
        console.log(`DELETE was not successfull: ${err}`);
    }
    
})



 


app.listen(PORT, () => console.log(`Listening at http://localhost:${PORT}`));