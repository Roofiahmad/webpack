import data from "../todos.json";
let todosData = data;

export function getAllTodos() {
  return todosData;
}

export function addTodo(todo) {
  todosData.push(todo);
}

export function removeTodo(id) {
  todosData = todosData.filter(function (item) {
    return item.id !== id;
  });
}

export function updateTodo(id, completed) {
  const itemIndex = todosData.findIndex(function (value) {
    return value.id === id;
  });
  todosData[itemIndex].completed = completed;
}
