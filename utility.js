export const sanitizeInput = (value) => {
    return value.replace(/(<([^>]+)>)/gi, "");
};

export const clearInputField = (inputElement) => {
    inputElement.value = "";
};

export const eventListenerHandler = (domElement, event, handlerFunction) => {
    domElement.addEventListener(`${event}`, handlerFunction);
};
