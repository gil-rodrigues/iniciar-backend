import express from 'express';

const app = express();

app.get('/',(req,res) => {
    return res.json({message: "I want to fry some potatoes"})
});

app.listen(3333, () => {
    console.log('Server started on port 3333. . .');
});