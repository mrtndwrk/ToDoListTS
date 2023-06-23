// import { type } from "os";
import { v4 as uuidv4 } from 'uuid';

type Task = {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
};

console.log(uuidv4());

const list = document.querySelector<HTMLOListElement>('#list');
const form = document.getElementById('new-task-form') as HTMLFormElement | null;
const input = document.querySelector<HTMLInputElement>('#new-task-title');
const tasks: Task[] = loadTasks();
tasks.forEach(addListItem)

form?.addEventListener('submit', (e) => {
  e.preventDefault();

  if (input?.value == '' || input?.value == null) return;

  const newTask: Task = {
    id: uuidv4(),
    title: input.value,
    completed: false,
    createdAt: new Date(),
  };
  tasks.push(newTask);
  saveTasks();
  addListItem(newTask);
  input.value = '';
});

function addListItem(task: Task) {
  const item = document.createElement('li');
  const label = document.createElement('label');
  const checkbox = document.createElement('input');
  
  checkbox.addEventListener('change', (e) => {
    task.completed = checkbox.checked;
    saveTasks();
    if(task.completed) {
      removeListItem(task);
    }
  })
  
  checkbox.type = 'checkbox';
  checkbox.checked = task.completed;
  label.append(checkbox, task.title);
  item.append(label);
  list?.append(item);
}

function removeListItem(task: Task) {
  // Remove from tasks array
  const index = tasks.findIndex(t => t.id === task.id);
  if(index !== -1) tasks.splice(index, 1);

  // Remove from DOM
  const items = list?.getElementsByTagName('li') || [];
  for(let item of items) {
    const label = item.firstChild;
    if(label?.textContent?.trim() === task.title) {
      list?.removeChild(item);
      break;
    }
  }

  // Save updated tasks
  saveTasks();
}

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks(): Task[] {
  const taskJSON = localStorage.getItem('tasks');
  if(taskJSON == null) return []
  return JSON.parse(taskJSON)
}
