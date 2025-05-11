import { formatDistanceToNow } from 'date-fns';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

import './Task.css';

export default class Task extends Component {
  static defaultProps = {
    description: 'text',
    created: new Date(),
    onDeleted: () => {},
    onToggleCompleted: () => {},
    completed: true
  };

  static propTypes = {
    description: PropTypes.node,
    created: PropTypes.instanceOf(Date),
    onDeleted: PropTypes.func,
    onToggleCompleted: PropTypes.func,
    completed: PropTypes.bool
  };

  taskRef = null;

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  handleClickOutside = (event) => {
    const { editing, toggleEditing, id } = this.props;
    if (editing[id] && this.taskRef && !this.taskRef.contains(event.target)) {
      toggleEditing();
    }
  };

  setTaskRef = (element) => {
    this.taskRef = element;
  };

  render() {
    const {
      other: { description, created, completed, remainingSeconds, isTimerRunning },
      id,
      onDeleted,
      onToggleCompleted,
      startTimer,
      stopTimer,
      toggleEditing,
      editing,
      handleKeyDown
    } = this.props;

    const isEditing = editing[id] === true;

    const minutes = Math.floor(remainingSeconds / 60)
      .toString()
      .padStart(2, '0');
    const seconds = (remainingSeconds % 60).toString().padStart(2, '0');

    const timeAgo = formatDistanceToNow(created, { includeSeconds: true, addSuffix: true });

    return (
      <li className={completed ? 'completed' : isEditing ? 'editing' : ''} ref={this.setTaskRef}>
        <div className="view">
          <input
            className="toggle"
            type="checkbox"
            checked={completed}
            onChange={onToggleCompleted}
          />
          <label>
            <span className="title" onDoubleClick={toggleEditing}>
              {description}
            </span>
            <span className="description">
              <button
                className="icon icon-play"
                onClick={startTimer}
                disabled={isTimerRunning || remainingSeconds <= 0}
              />
              <button
                className="icon icon-pause"
                onClick={stopTimer}
                disabled={!isTimerRunning || remainingSeconds <= 0}
              />
              {minutes}:{seconds}
            </span>
            <span className="description">created {timeAgo}</span>
          </label>
          <button className="icon icon-edit" onClick={toggleEditing} />
          <button className="icon icon-destroy" onClick={onDeleted} />
        </div>
        <input type="text" className="edit" onKeyDown={(event) => handleKeyDown(event, id)} />
      </li>
    );
  }
}
