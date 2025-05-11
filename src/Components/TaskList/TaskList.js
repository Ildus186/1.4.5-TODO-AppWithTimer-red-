import PropTypes from 'prop-types';
import React, { Component } from 'react';

import Task from '../Task/Task';

import './TaskList.css';

export default class TaskList extends Component {
  static defaultProps = {
    todos: [],
    onDeleted: () => {},
    onToggleCompleted: () => {}
  };

  static propTypes = {
    todos: PropTypes.arrayOf(PropTypes.object),
    onDeleted: PropTypes.func,
    onToggleCompleted: PropTypes.func
  };

  render() {
    const {
      todos,
      onDeleted,
      onToggleCompleted,
      stopTimer,
      startTimer,
      toggleEditing,
      editing,
      handleKeyDown
    } = this.props;

    const elements = todos.map((item) => {
      const { id, ...other } = item;
      return (
        <Task
          key={id}
          id={id}
          other={other}
          onDeleted={() => onDeleted(id)}
          onToggleCompleted={() => onToggleCompleted(id)}
          stopTimer={() => stopTimer(id)}
          startTimer={() => startTimer(id)}
          toggleEditing={() => toggleEditing(id)}
          editing={editing}
          handleKeyDown={(event) => handleKeyDown(event, id)}
        />
      );
    });

    return <ul className="todo-list">{elements}</ul>;
  }
}
