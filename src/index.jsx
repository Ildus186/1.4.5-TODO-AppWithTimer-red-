import React, { Component } from 'react';
import { createRoot } from 'react-dom/client';

import Footer from './Components/Footer/Footer';
import NewTaskForm from './Components/NewTaskForm/NewTaskForm';
import TaskList from './Components/TaskList/TaskList';

export default class App extends Component {
  maxId = 100;

  timerInterval = {};

  state = {
    todoData: [
      this.createTodoItem('Complete', '05', '06'),
      this.createTodoItem('Editing task', '06', '02'),
      this.createTodoItem('Active task', '10', '10')
    ],
    filter: 'all',
    editing: {}
  };

  toggleEditing = (id) => {
    this.setState((prevState) => ({
      editing: {
        ...prevState.editing,
        [id]: !prevState.editing[id]
      }
    }));
  };

  handleKeyDown = (event, id) => {
    if (event.key === 'Escape') {
      this.toggleEditing(id);
    }

    if (event.key === 'Enter') {
      const { todoData } = this.state;
      const idx = todoData.findIndex((element) => element.id === id);

      const value = event.target.value.trim();
      if (!value) {
        this.toggleEditing(id);
        return;
      }

      this.setState(
        (prevState) => {
          const newArray = [...prevState.todoData];
          newArray[idx] = { ...newArray[idx], description: value };
          return {
            todoData: newArray
          };
        },
        () => {
          this.toggleEditing(id);
        }
      );
    }
  };

  filterTodos = (array, filter) => {
    if (filter === 'active') {
      return array.filter((item) => !item.completed);
    }
    if (filter === 'completed') {
      return array.filter((item) => item.completed);
    }
    return array;
  };

  setFilter = (filter) => {
    this.setState({ filter });
  };

  deleteItem = (id) => {
    this.stopTimer(id);
    this.setState(
      ({ todoData, editing }) => {
        const idx = todoData.findIndex((el) => el.id === id);
        const newArray = [...todoData.slice(0, idx), ...todoData.slice(idx + 1)];
        const newEditing = { ...editing };
        delete newEditing[id];
        return {
          todoData: newArray,
          editing: newEditing
        };
      },
      () => {
        clearInterval(this.timerInterval[id]);
        delete this.timerInterval[id];
      }
    );
  };

  clearCompleted = () => {
    this.setState(({ todoData }) => {
      const newArray = todoData.filter((el) => !el.completed);
      return { todoData: newArray };
    });
  };

  addItem = (description, minuteTimer, secondTimer) => {
    const newItem = this.createTodoItem(description, minuteTimer, secondTimer);
    this.setState(({ todoData }) => {
      const newArray = [...todoData, newItem];
      return { todoData: newArray };
    });
  };

  startTimer = (id) => {
    this.setState(
      (prevState) => ({
        todoData: prevState.todoData.map((item) => {
          if (item.id === id) {
            return {
              ...item,
              remainingSeconds: item.remainingSeconds,
              isTimerRunning: true
            };
          }
          return item;
        })
      }),
      () => {
        this.timerInterval[id] = setInterval(() => {
          this.setState(
            (prevState) => ({
              todoData: prevState.todoData.map((item) => {
                if (item.id === id) {
                  return {
                    ...item,
                    remainingSeconds: item.remainingSeconds - 1
                  };
                }
                return item;
              })
            }),
            () => {
              const task = this.state.todoData.find((item) => item.id === id);
              if (task && task.remainingSeconds <= 0) {
                this.stopTimer(id);
              }
            }
          );
        }, 1000);
      }
    );
  };

  stopTimer = (id) => {
    this.setState(
      (prevState) => ({
        todoData: prevState.todoData.map((item) => {
          if (item.id === id) {
            return {
              ...item,
              isTimerRunning: false
            };
          }
          return item;
        })
      }),
      () => {
        clearInterval(this.timerInterval[id]);
        delete this.timerInterval[id];
      }
    );
  };

  onToggleCompleted = (id) => {
    this.setState(({ todoData }) => {
      const idx = todoData.findIndex((el) => el.id === id);

      const oldItem = todoData[idx];
      const newItem = { ...oldItem, completed: !oldItem.completed };
      const newArray = [...todoData.slice(0, idx), newItem, ...todoData.slice(idx + 1)];
      return { todoData: newArray };
    });
  };

  createTodoItem(description, minuteTimer, secondTimer) {
    const minutes = parseInt(minuteTimer, 10) || 0;
    const seconds = parseInt(secondTimer, 10) || 0;
    const totalSeconds = minutes * 60 + seconds;
    return {
      description,
      totalSeconds,
      remainingSeconds: totalSeconds,
      created: new Date(),
      completed: false,
      isTimerRunning: false,
      id: this.maxId++
    };
  }

  render() {
    const { todoData, filter, editing } = this.state;
    const visibleTodos = this.filterTodos(todoData, filter);

    const completedCount = this.state.todoData.filter((el) => !el.completed).length;

    return (
      <section className="todoapp">
        <NewTaskForm onAdd={this.addItem} />
        <section className="main">
          <TaskList
            todos={visibleTodos}
            onDeleted={this.deleteItem}
            onToggleCompleted={this.onToggleCompleted}
            startTimer={this.startTimer}
            stopTimer={this.stopTimer}
            toggleEditing={this.toggleEditing}
            editing={editing}
            handleKeyDown={this.handleKeyDown}
          />
          <Footer
            uncompleted={completedCount}
            clearCompleted={this.clearCompleted}
            setFilter={this.setFilter}
            filter={filter}
          />
        </section>
      </section>
    );
  }
}

const root = createRoot(document.getElementById('root'));
root.render(<App />);
