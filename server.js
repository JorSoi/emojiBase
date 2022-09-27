
const express = require('express');
const emojiDatabase = require('./emojiDatabase').emojis;
const app = express();
const morgan = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');
const PORT = process.env.port || 3000;
const pool = require('./emojidb');

app.use(cors(), morgan('tiny'));
app.use(bodyParser.json());
  
app.get('/emojis', (req, res) => {
    res.send(emojiDatabase);
});

app.get('/emojis/:name', (req, res) => {
    let filteredEmoji = emojiDatabase.filter((emoji) => {
        return emoji.description == decodeURI(req.params.name);
    })
    res.send(filteredEmoji);
});

app.get('/emojis/edit/:id', (req, res) => {
    res.send(emojiDatabase[req.params.id]);
})

app.post('/emojis', (req, res) => {
    if (req.body.newEmoji != '' && req.body.newDescription != '') {
        emojiDatabase.push({
            id: id++,
            emoji: req.body.newEmoji,
            description: req.body.newDescription
        })
    } else {
        res.sendStatus(400);
    }
})


app.delete('/emojis/delete/:id', (req, res) => {
    
})



 


app.listen(PORT, () => console.log(`Listening at http://localhost:${PORT}`));