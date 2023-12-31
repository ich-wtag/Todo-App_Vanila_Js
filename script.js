// all the dom elements are selected
const addTodoInputElement = document.getElementById("addTodoInputField");
const addTodoButton = document.getElementById("addTodoButton");
const allTodoContainer = document.getElementById("todosContainer");

// global variables
let allTodosArray = [];

// input data sanitization by using removing any tags
const dataSanitization = (value) => {
    return value.replace(/(<([^>]+)>)/gi, "");
};

// get the todo title from the input element
const addTodoHandler = () => {
    let todoTitle = addTodoInputElement.value;
    if (!todoTitle.length) {
        alert("Please enter a valid text");
        return;
    }

    allTodosArray.unshift({
        id: new Date().getTime(),
        title: dataSanitization(todoTitle),
    });

    renderTodoArray(allTodosArray);
};

// render functions to update the dom
const renderTodoArray = (toBeRenderedArray) => {
    allTodoContainer.innerHTML = "";

    const finalRenderedTodos = toBeRenderedArray
        .map((todo) => {
            return `<li>${todo.title}</li>`;
        })
        .join("");

    allTodoContainer.innerHTML = finalRenderedTodos;
};

// global event listeners
addTodoButton.addEventListener("click", addTodoHandler);
