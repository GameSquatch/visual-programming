const fs = require('fs/promises');
const path = require('path');


exports.writeGoProgram = writeGoProgram;


function writeGoProgram(flowState) {
    const writePromises = [];
    console.log(flowState.main.variables);

    for (const functionName in flowState) {
        writePromises.push(
            writeVariableBlock(flowState[functionName].variables)
                .then((_) => {
                    return writeFlowSteps(flowState[functionName].flowSteps);
                })
        );
    }

    return Promise.all(writePromises);
}


function writeVariableBlock(variablesObj) {
    const varLines = [];

    for (const varName in variablesObj) {
        varLines.push(`${variablesObj[varName].name} := "${variablesObj[varName].initialValue}"`);
    }

    varLines.push('\n');
    const textToWrite = varLines.join('\n');

    return fs.writeFile(path.join(__dirname, "go/program.go"), textToWrite, {
        flag: "a",
        encoding: "utf-8"
    });
}


function writeFlowSteps(flowStepsObj) {
    const stepLines = [];

    const orderedStepIds = Object.keys(flowStepsObj).sort((flowStepIdA, flowStepIdB) => {
        return flowStepsObj[flowStepA].order - flowStepsObj[flowStepB].order;
    });

    orderedStepIds.forEach((stepId) => {
        const step = flowStepsObj[stepId];
        stepLines.push(`${step.varName} = "${step.setTo}"`);
    });

    stepLines.push('\n');
    const textToWrite = stepLines.join('\n');

    return fs.writeFile(path.join(__dirname, "go/program.go"), textToWrite, {
        flag: "a",
        encoding: "utf-8"
    });
}
