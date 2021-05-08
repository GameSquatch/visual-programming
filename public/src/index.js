import { v4 as uuidv4 } from '/src/lib/uuid/index.js';

//console.log(uuidv4());

const variableEntryHtml = `
    <div class="var-row">
        <input required type="text" class="var-name" placeholder="variable_name" />
        <span>:</span>
        <select class="var-type">
            <option value="string" selected>string</option>
            <option value="number">number</option>
            <option value="boolean">boolean</option>
        </select>
        <span>=</span>
        <input type="text" class="var-initial-val" />
        <button type="button" class="remove-var-entry">-</button>
        <div class="var-drag-handle"></div>
    </div>
`;
const $varBox = $(".var-box");

window.flowState = {
    "main": {
        "variables": {},
        "flowSteps": {}
    }
};

const $flowSection = $(".flow-section");

let flowStepsCounter = 0;

$(document).on("varEntryChange", (evt) => {
    console.log(evt.detail);
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
    const $varEntry = $(variableEntryHtml).appendTo(".var-entry-container");
});

$(".var-box").on("click", ".remove-var-entry", (evt) => {
    const $varRow = $(evt.target).parent();
    const varName = $varRow.find(".var-name").val();

    if (varName !== "" && varName in flowState.main.variables) {
        delete flowState.main.variables[varName];
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

    const varType = $varRow.find(".var-type").val();
    const varInitialVal = $varRow.find(".var-initial-val").val();

    const oldName = $varName.data("prev-name");
    if (oldName !== "" && oldName != $varName.val()) {
        delete flowState.main.variables[oldName];
    }

    flowState.main.variables[$varName.val()] = {
        "name": $varName.val(),
        "type": varType,
        "initialValue": varInitialVal
    }
});


$(".var-box").on("mouseenter", ".var-drag-handle", (evt) => {
    const dragHandle = $(evt.target);
    const varNameOnMouseEnter = dragHandle.parent().find(".var-name").val();
    if (varNameOnMouseEnter && !dragHandle.data("drag-set")) {
        dragHandle.data("drag-set", true).draggable({
            helper: () => {
                const helper = document.createElement('div');
                const parent = dragHandle.parent();
                helper.classList.add("var-drag-helper");
                helper.textContent = parent.find(".var-name").val();
                helper.setAttribute("data-data-type", parent.find(".var-type").val());
                return helper;
            },
            cursorAt: {
                right: 5,
                bottom: 5
            },
            appendTo: ".flow-section"
        });
    }
});


$flowSection.on("click", ".add-after-step", (evt) => {
    const $stepWrapper = $(evt.target).parent();
    createNewFlowStep($stepWrapper, ++flowStepsCounter);
});
$flowSection.on("change", ".step-set", (evt) => {
    const $input = $(evt.target);
    const $stepWrapper = $input.parents(".step-wrapper")[0];
    flowState.main.flowSteps[$stepWrapper.id].setTo = $input.val();
});

const $addStepBtn = $("#add-step");

$addStepBtn.on("click", (evt) => {
    createNewFlowStep($addStepBtn.parent(), ++flowStepsCounter);
    $addStepBtn.hide();
});


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


function createNewFlowStep($insertAfter, flowStepCount) {
    const $newFlowStep = $(`
        <div id="step-${flowStepCount}" class="step-wrapper">
            <div class="step-container">
                <p>Action</p>
                <div class="step-drop-area"></div>
            </div>

            <button type="button" class="add-btn add-after-step">+</button>
        </div>
    `);
    $newFlowStep.find(".step-drop-area").droppable({
        drop: stepDropHandler,
        activeClass: "highlight-step"
    });
    $newFlowStep.insertAfter($insertAfter);

}