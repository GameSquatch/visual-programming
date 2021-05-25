import { v4 as uuidv4 } from '/src/lib/uuid/index.js';
import { throttleUiEvt } from './utils.js';
import { HtmlString } from './HtmlCreationStrings.js';
import { varDragHelper } from './dragHelpers.js';


//console.log(uuidv4());

(function(doc, win) {

    attachListeners();

    window.flowState = {
        "main": {
            "variables": {},
            "flowSteps": {}
        }
    };


    function attachListeners() {
        const $flowSection = $(".flow-section");

        $flowSection.on("click", ".add-after-step", (evt) => {
            const $stepWrapper = $(evt.target).parent();
            createNewFlowStep($stepWrapper);
        });
        $flowSection.on("click", ".delete-step", (evt) => {
            $(evt.target).parents(".step-wrapper").remove();
            if ($(".step-wrapper").length === 0) {
                $(".drag-msg").show();
            }
        });
        $flowSection.on("change", ".step-set", (evt) => {
            const $input = $(evt.target);
            const $stepWrapper = $input.parents(".step-wrapper")[0];
            flowState.main.flowSteps[$stepWrapper.id].setTo = $input.val();
        });

        $("#run-code").on("click", (evt) => {
            fetch("/run-code", {
                headers: {
                    "Content-Type": "application/json"
                },
                method: "POST",
                body: JSON.stringify(flowState)
            }).then((resp) => resp.text())
                .then((respText) => console.log(respText))
                .catch((err) => console.error(`Error: ${err}`));
        });

        $("#add-var-entry").on("click", (evt) => {
            const $varEntry = $(HtmlString.variableEntry).appendTo(".var-entry-container");
        });
        
        $(".var-box").on("click", ".remove-var-entry", (evt) => {
            const $varRow = $(evt.target).parent();
            const varName = $varRow.find(".var-name").val();
        
            if (varName !== "" && varName in flowState.main.variables) {
                //delete flowState.main.variables[varName];
                $varRow.remove();
            }
        });
        
        $(".var-box").on("focus", ".var-name", (evt) => {
            $(evt.target).data("prev-name", evt.target.value);
        });
        
        
        $(".var-box").on("change", (evt) => {
            const $varRow = $(evt.target).parent();
            const $varName = $varRow.find(".var-name");
            if ($varName.val() === "") {
                return;
            }
        });
        
        
        $(".var-box").on("mouseenter", ".var-drag-handle", (evt) => {
            const dragHandle = $(evt.target);
            const varNameOnMouseEnter = dragHandle.parent().find(".var-name").val();
            if (varNameOnMouseEnter && !dragHandle.data("drag-set")) {
                dragHandle.data("drag-set", true).draggable({
                    helper: () => {
                        return varDragHelper(dragHandle.parent());
                    },
                    cursorAt: {
                        right: 5,
                        bottom: 5
                    }/*,
                    appendTo: ".flow-section"*/
                });
            }
        });
    }// end attach listeners

})(document, window);


const $varBox = $(".var-box");
const $flowSection = $(".flow-section");

let flowStepsCounter = 0;


// The flow section "root" droppable
$flowSection.droppable({
    classes: {
        "ui-droppable-hover": "highlight-step"
    },
    drop: flowSectionDropHandler
});


function flowSectionDropHandler(evt, { helper }) {
    $(".drag-msg").hide();
        
    //console.log(`Pos: ${position.top}\nOffset: ${offset.top}`);
    const stepElems = [...document.querySelectorAll(".step-wrapper")];

    if (stepElems.length === 0) {
        createNewFlowStep($(".step-btn-container"));
        return;
    }

    const helperBox = helper[0].getBoundingClientRect();
    const helperYCenter = helperBox.y + (helperBox.height / 2);

    // If there was only one step, it will skip the loop and prepend.
    // Now we need to check if the new step was dropped after that step.
    const elemBox = stepElems[0].getBoundingClientRect();
    if (stepElems.length === 1 && helperYCenter > (elemBox.y + (elemBox.height / 2)) ) {
        createNewFlowStep($(stepElems[0]));
        return;
    }

    let insertAfterElem = $(".step-btn-container");

    for (let i = 0; i < stepElems.length - 1; i += 1) {
        const currentElem = stepElems[i];
        const nextElem = stepElems[i + 1];
        const currentElemBox = currentElem.getBoundingClientRect();
        const currentElemYCenter = currentElemBox.y + (currentElemBox.height / 2);
        const nextElemBox = nextElem.getBoundingClientRect();
        const nextElemYCenter = nextElemBox.y + (nextElemBox.height / 2);

        // If the helper was dropped in between two elements
        if (helperYCenter >= currentElemYCenter && helperYCenter < nextElemYCenter) {
            insertAfterElem = $(currentElem);
            break;
        }

        // If the helper was dropped at the end of the list
        if (i === stepElems.length - 2 && helperYCenter >= nextElemYCenter) {
            insertAfterElem = $(nextElem);
        }
    }

    createNewFlowStep(insertAfterElem);
}


function createNewFlowStep($insertAfter) {
    const $newFlowStep = $(HtmlString.flowStep);

    $newFlowStep.attr("id", uuidv4());

    $newFlowStep.find(".step-drop-area").droppable({
        drop: stepDropHandler,
        classes: {
            "ui-droppable-hover": "highlight-step"
        },
        greedy: true
    });

    $newFlowStep.insertAfter($insertAfter);
}


function createVarInFlowStepHtml(varName, varType) {
    let inputType = varType;
    if (inputType == "boolean") {
        inputType = "checkbox";
    }

    flowState.main.flowSteps["step-" + flowStepsCounter] = {
        varName,
        varType
    };

    return `
        <div>
            <span>${varName}</span>
            <select>
                <option value="set" selected>Set To</option>
            </select>
            <input class="step-set" type="${inputType}" />
        </div>
    `;
}


function stepDropHandler(evt, ui) {
    console.log(evt.target);
    const varName = ui.helper.text();
    const varType = ui.helper.attr("data-data-type");
    $(createVarInFlowStepHtml(varName, varType)).appendTo(evt.target);
}





