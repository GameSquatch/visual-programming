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

let flowState = {
    "main": {
        "variables": {},
        "flowSteps": []
    }
};

const $flowSection = $(".flow-section");


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

$(".var-box").on("change", ".var-name", (evt) => {
    const $varNameInput = $(evt.target);
    const varName = $varNameInput.val();
    const $varRow = $varNameInput.parent();

    if (varName !== "") {
        const oldName = $varNameInput.data("prev-name");
        if (oldName !== "") {
            delete flowState.main.variables[oldName];
        }

        flowState.main.variables[varName] = {
            "name": varName,
            "initialValue": $varRow.find(".var-initial-val").val(),
            "type": $varRow.find(".var-type").val()
        };
    }
});
$(".var-box").on("change", ".var-type", (evt) => {
    const $varTypeSelect = $(evt.target);
    const $varRow = $varTypeSelect.parent();
    const varName = $varRow.find(".var-name").val();

    if (varName === "") {
        return;
    }

    flowState.main.variables[varName].type = $varTypeSelect.val();
});
$(".var-box").on("change", ".var-initial-val", (evt) => {
    const $varInitialVal = $(evt.target);
    const $varRow = $varTypeSelect.parent();
    const varName = $varRow.find(".var-name").val();

    if (varName === "") {
        return;
    }

    flowState.main.variables[varName].initialValue = $varInitialVal.val();
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
    createNewFlowStep($stepWrapper);
});

const $addStepBtn = $("#add-step");

$addStepBtn.on("click", (evt) => {
    createNewFlowStep($addStepBtn.parent());
    $addStepBtn.hide();
});


function createVarInFlowStepHtml(varName, varType) {
    let inputType = varType;
    if (inputType == "boolean") {
        inputType = "checkbox";
    }

    return `
        <div>
            <span>${varName}</span>
            <select>
                <option value="set" selected>Set To</option>
            </select>
            <input type="${inputType}" />
        </div>
    `;
}


function stepDropHandler(evt, ui) {
    const varName = ui.helper.text();
    const varType = ui.helper.attr("data-data-type");
    $(createVarInFlowStepHtml(varName, varType)).appendTo(evt.target);
}


function createNewFlowStep($insertAfter) {
    const $newFlowStep = $(`
        <div class="step-wrapper">
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