export { throttleUiEvt };

function throttleUiEvt(callback, limit) {
    let running = false;
    return function(evt, { helper, position, offset }) {
        if (!running) {
            callback(evt, { helper, position, offset });
            running = true;

            setTimeout(() => running = false, limit);
        }
    }
}