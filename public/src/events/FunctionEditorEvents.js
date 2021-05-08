
export const FunctionEditorEvents = {
    dispatchVarEntryChange: (varName, varType, varInitialValue) => {
        const varEntryChange = new CustomEvent("varEntryChange", {
            detail: {
                varName,
                varType,
                varInitialValue
            }
        });

        document.dispatchEvent(varEntryChange);
    },

    dispatchVarEntryDelete: (varName) => {
        const varEntryDelete = new CustomEvent("varEntryDelete", {
            detail: varName
        });

        document.dispatchEvent(varEntryDelete);
    }
};