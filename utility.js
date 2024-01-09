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

export const showCompletedTodo = (paragraphElement, editButton, doneButton) => {
    paragraphElement.classList.add("done-todo");
    editButton.classList.add("hide");
    doneButton.classList.add("hide");
};
