

export function dispatchVarEntryChange(varName, oldVarName, varType, varInitialValue) {
    const varEntryChange = new CustomEvent("varEntryChange", {
        detail: {
            varName,
            oldVarName,
            varType,
            varInitialValue
        }
    });

    document.dispatchEvent(varEntryChange);
}


export function dispatchVarEntryDelete(varName) {
    const varEntryDelete = new CustomEvent("varEntryDelete", {
        detail: varName
    });

    document.dispatchEvent(varEntryDelete);
}