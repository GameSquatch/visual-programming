const express = require('express');
const app = express();
const port = process.env.PORT || 3000;


app.use(express.static('public'));


app.get('/', (req, res) => {
  res.send('Hello World!')
});

app.post('/run-code', express.json(), (req, res) => {
    let firstFlowStepVarName = 'not found';
    if (req.body.main && req.body.main.flowSteps) {
        firstFlowStepVarName = req.body.main.flowSteps[0].varName;
    }

    res.send(`Node received JSON: '${firstFlowStepVarName}'`);
});


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});