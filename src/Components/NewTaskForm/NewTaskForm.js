import PropTypes from 'prop-types';
import React, { Component } from 'react';
import './NewTaskForm.css';

export default class NewTaskForm extends Component {
  static defaultProps = {
    onAdd: () => {}
  };

  static propTypes = {
    onAdd: PropTypes.func
  };

  state = {
    label: '',
    minuteTimer: '',
    secondTimer: ''
  };

  onLabelChange = (e) => {
    this.setState(
      {
        label: e.target.value
      },
      this.validateForm
    );
  };

  onMinuteChange = (e) => {
    const { value } = e.target;
    let newValue = value.replace(/\s/g, '');
    newValue = newValue.replace(/^0/, '');
    const parsedValue = parseInt(newValue, 10);
    if (Number.isNaN(parsedValue)) {
      newValue = '';
    }
    this.setState(
      {
        minuteTimer: newValue
      },
      this.validateForm
    );
  };

  onSecondChange = (e) => {
    const { value } = e.target;
    let newValue = value.replace(/\s/g, '');
    newValue = newValue.replace(/^0/, '');
    const parsedValue = parseInt(newValue, 10);
    if (Number.isNaN(parsedValue)) {
      newValue = '';
    } else if (parsedValue > 59) {
      newValue = 59;
    }
    this.setState(
      {
        secondTimer: newValue
      },
      this.validateForm
    );
  };

  validateForm = () => {
    const { label, minuteTimer, secondTimer } = this.state;
    const hasLabel = label.trim() !== '';
    const hasTime = minuteTimer !== '' || secondTimer !== '';

    const isValid = hasLabel && hasTime;
    return isValid;
  };

  onSubmit = (e) => {
    e.preventDefault();
    if (this.validateForm()) {
      this.props.onAdd(this.state.label, this.state.minuteTimer, this.state.secondTimer);
      this.setState(() => ({ label: '', minuteTimer: '', secondTimer: '' }));
    }
  };

  render() {
    return (
      <header className="header">
        <h1>todos</h1>
        <form onSubmit={this.onSubmit} className="new-todo-form">
          <input
            value={this.state.label}
            onChange={this.onLabelChange}
            className="new-todo"
            placeholder="Task"
            autoFocus
          />
          <input
            value={this.state.minuteTimer}
            onChange={this.onMinuteChange}
            className="new-todo-form__timer"
            placeholder="Min"
          />
          <input
            value={this.state.secondTimer}
            onChange={this.onSecondChange}
            className="new-todo-form__timer"
            placeholder="Sec"
          />
          <button type="submit" />
        </form>
      </header>
    );
  }
}
