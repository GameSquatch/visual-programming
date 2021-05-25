
const HtmlString = {
    flowStep: `
<div class="step-wrapper">
    <div class="step-container">
        <div class="flex w-100">
            <select>
                <option value="action">Action</option>
                <option value="if">If</option>
            </select>
            <div class="flex-grow-1"></div>
            <button type="button" class="delete-step">remove</button>
        </div>
        <div class="step-drop-area"></div>
    </div>

    <button type="button" class="add-btn add-after-step">+</button>
</div>
`,
    variableEntry: `
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
`
};

export { HtmlString };