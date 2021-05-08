
class VariableDefRow extends HTMLElement {
    constructor() {
        super();

        const ROW_ITEM_CLASS = "var-row-item";

        const shadow = this.attachShadow({mode: "open"});

        const rootDiv = document.createElement("div");
        rootDiv.classList.add("var-row");

        const varNameInput = document.createElement("input");
        varNameInput.setAttribute("type", "text");
        varNameInput.setAttribute("placeholder", "var_name");
        varNameInput.required = true;
        varNameInput.classList.add(ROW_ITEM_CLASS);
        rootDiv.appendChild(varNameInput);

        const colonSpan = document.createElement("span");
        colonSpan.classList.add(ROW_ITEM_CLASS);
        colonSpan.textContent = ":";
        rootDiv.appendChild(colonSpan);

        const typeSelect = document.createElement("select");
        typeSelect.classList.add([ROW_ITEM_CLASS, "var-type"]);
        ["string", "number", "boolean"].forEach((type, i) => {
            const option = document.createElement("option");
            option.setAttribute("value", type);
            option.selected = i === 0;
            option.textContent = type;
            typeSelect.appendChild(option);
        });
        rootDiv.appendChild(typeSelect);

        const equalsSpan = document.createElement("span");
        equalsSpan.classList.add(ROW_ITEM_CLASS);
        equalsSpan.textContent = "=";
        rootDiv.appendChild(equalsSpan);

        const initalValueInput = document.createElement("input");
        initalValueInput.setAttribute("type", "text");
        initalValueInput.classList.add([ROW_ITEM_CLASS, "var-initial-val"]);
    }
}

customElements.define("var-def-row", VariableDefRow);