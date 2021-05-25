
export { varDragHelper };

function varDragHelper(varEntryElement) {
    const helper = document.createElement('div');
    helper.classList.add("var-drag-helper");
    helper.textContent = varEntryElement.find(".var-name").val();
    helper.setAttribute("data-data-type", varEntryElement.find(".var-type").val());
    return helper;
}
