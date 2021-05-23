
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
`
};

export { HtmlString };