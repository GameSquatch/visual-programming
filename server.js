const express = require('express');
const { writeGoProgram } = require('./server/write-go-program');
const app = express();
const port = process.env.PORT || 3000;


app.use(express.static('public'));


app.get('/', (req, res) => {
  res.send('Hello World!')
});


app.post('/run-code', express.json(), (req, res) => {

    writeGoProgram(req.body)
        .then((_) => {
            res.send("Done writing file");
        })
        .catch((err) => res.send(`Err: ${err}`));

    //res.send(`Node received JSON: '${firstFlowStepVarName}'`);
});


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});