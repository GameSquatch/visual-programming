export { createDropHandler };

function emptyStepDrop(evt, { draggable, helper, position, offset }) {
    const sourceType = helper.attr("data-source-type");
    const objId = helper.attr("data-obj-id");
    const $stepDropZoneElement = $(evt.target);// contains data-obj-id for the step
    if (sourceType === "variable") {
        // do variable stuff
        insertVarIntoStep($stepDropZoneElement, helper.attr("data-data-type"));// includes HTML and flowState modifications
    } else {
        //insertXIntoStep(stepDropZoneElement, helper.attr("data-return-type"));
    }
}


function createDropHandler(parentFlowStateRef) {
    return function(evt, { draggable, helper, position, offset }) {

    };
}


// drop zone types can be: arg or empty
// when something is dropped into emptiness, it should default to "set to" method
// when something is dropped into an arg position, it should default to "value" method
// if dropping a function, it should default to "run"
/**
 * 
 * @param {JQuery<HTMLElement>} $stepDropZoneElement 
 * @param {string} varDataType 
 */
function insertVarIntoStep($stepDropZoneElement, varDataType) {
    const dropZoneType = $stepDropZoneElement.attr("data-drop-zone-type");
    const flowStatePath = $stepDropZoneElement.attr("data-flow-state-path");
    $stepDropZoneElement.append(createStepVarElement(varDataType, dropZoneType, flowStatePath));
    
}


/**
 * 
 * @param {string} varDataType - can be number, string, boolean
 * @param {string} dropZoneType - can be empty or arg
 * @param {string} flowStatePath - dot-delimited path to the element in state
 */
function createStepVarElement(varDataType, dropZoneType, parentFlowStatePath) {
    const parentStateRef = fetchStateWithPath(parentFlowStatePath);
    //const newVarState = createStepVarState(varDataType);
    //let newVarState = JSON.parse(JSON.stringify(stepVarFlowStateBlocks[dropZoneType]));
    let pathAddition = `${parentFlowStatePath}.function.args.0`;

    if (dropZoneType === "empty") {
        parentStateRef.subject = createStepVarState(varDataType, "set to");
    } else if (dropZoneType === "arg") {
        parentStateRef.push(createStepVarState(varDataType, "value"));
    }

    const html = `
    <div class="step-item-container">
        <div class="step-item-action-row">
            <div>var name here</div>
            <div>
                <select>
                    <option value="set to" selected>set to</option>
                </select>
            </div>
            <div class="spacer"></div>
            <div>
                <button type="button" class="delete-btn"></button>
            </div>
        </div>
        <div data-drop-zone-type="arg" data-flow-state-path="">
            <input type="text" />
        </div>
    </div>
    `;

    return $(html);
}


/**
 * 
 * @param {string} pathStr - dot-delmited string containing the path to an object reference
 * @returns {Object}
 */
function fetchStateWithPath(pathStr) {
    let ref = flowState;
    pathStr.split(".").forEach((key) => {
        ref = ref[key];
    });

    return ref;
}


function createStepVarState(dataType, startMethod) {
    return {
        sourceType: "variable",
        dataType,
        id: generateUUID(),
        function: {
            id: startMethod,
            returnType: "",
            args: []
        }
    };
}


function generateUUID() {
    // TODO
}


const stepVarFlowStateBlocks = {
    "empty": {
        sourceType: "variable",
        dataType: "",
        id: "",
        function: {
            id: "set to",
            returnType: "",
            args: []
        }
    },
    "arg": {
        sourceType: "variable",
        dataType: "",
        id: "",
        function: {
            id: "value",
            returnType: "",
            args: []
        }
    }
};