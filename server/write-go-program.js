const fs = require('fs/promises');
const path = require('path');


exports.writeGoProgram = writeGoProgram;

const rootFolder = path.join(__dirname, "go");


function writeGoProgram(flowState) {
    const writePromises = [];

    writePromises.push(writeEntryFile());

    for (const functionName in flowState) {
        writePromises.push(
            writeVariableBlock(functionName, flowState[functionName].variables)
                .then((_) => {
                    return writeFlowSteps(functionName, flowState[functionName].flowSteps);
                })
        );
    }

    return Promise.all(writePromises);
}


function writeEntryFile() {
    const entryFileText = `package main
    
    func main() {
        startProgram()
    }`;

    return fs.writeFile(rootFolder + "/entry.go", entryFileText, {
        flag: "w",
        encoding: "utf-8"
    });
}


function writeFunctionInitBlock(functionName, variablesObj) {
    const varLines = ["package main\n"];

    if (functionName === "main") {
        varLines.push("func startProgram() {");
    } else {
        varLines.push(`func ${functionName}() {`);
    }

    for (const varName in variablesObj) {
        varLines.push(`${variablesObj[varName].name} := "${variablesObj[varName].initialValue}"`);
    }

    varLines.push("\n");
    const textToWrite = varLines.join('\n');

    return fs.writeFile(rootFolder + `/${functionName}.go`, textToWrite, {
        flag: "w",
        encoding: "utf-8"
    });
}


function writeFlowSteps(functionName, flowStepsObj) {
    const stepLines = [];

    const orderedStepIds = Object.keys(flowStepsObj).sort((flowStepIdA, flowStepIdB) => {
        return flowStepsObj[flowStepIdA].order - flowStepsObj[flowStepIdB].order;
    });

    orderedStepIds.forEach((stepId) => {
        const step = flowStepsObj[stepId];
        stepLines.push(`${step.varName} = "${step.setTo}"`);
    });

    stepLines.push("}");
    const textToWrite = stepLines.join('\n');

    return fs.writeFile(rootFolder + `/${functionName}.go`, textToWrite, {
        flag: "a",
        encoding: "utf-8"
    });
}
