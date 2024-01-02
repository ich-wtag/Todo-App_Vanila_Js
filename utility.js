import { $errorMessageElement } from "./element.js";
export const sanitizeInput = (value) => {
    return value.replace(/(<([^>]+)>)/gi, "");
};

export const clearInputField = (inputElement) => {
    inputElement.value = "";
};

export const showErrorMessage = (message) => {
    $errorMessageElement.classList.remove("hide");
    $errorMessageElement.innerHTML = message;
};
