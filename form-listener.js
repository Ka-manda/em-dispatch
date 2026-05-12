/**
 * form-listener.js
 * Captures all inputs from the dispatch form and serializes them into a flat JSON object.
 * Handles inputs, selects, textareas, radios, and checkboxes.
 */
export const captureDispatchState = () => {
    const form = document.getElementById('dispatch-form');
    if (!form) {
        console.warn("[EMListen] No form found with ID 'dispatch-form'.");
        return {};
    }

    const payload = {};
    const formData = new FormData(form);

    for (const [key, value] of formData.entries()) {
        if (Object.prototype.hasOwnProperty.call(payload, key)) {
            if (Array.isArray(payload[key])) {
                payload[key].push(value);
            } else {
                payload[key] = [payload[key], value];
            }
        } else {
            payload[key] = value;
        }
    }

    console.log("[EMListen] Captured form state:", payload);
    return payload;
};
