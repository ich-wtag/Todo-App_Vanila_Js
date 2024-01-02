export const sanitizeInput = (value) => {
    return value.replace(/(<([^>]+)>)/gi, "");
};

export const clearInputField = (inputElement) => {
    inputElement.value = "";
};
