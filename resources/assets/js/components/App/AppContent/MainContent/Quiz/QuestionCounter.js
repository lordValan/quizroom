import React from 'react';
import PropTypes from 'prop-types';

function QuestionCounter(props) {
    return (
      <div className="question-counter">
        Вопрос <span>{props.counter}</span> из <span>{props.total}</span>
      </div>
    );
  }

  QuestionCounter.propTypes = {
    counter: PropTypes.number.isRequired,
    total: PropTypes.number.isRequired
  };

  export default QuestionCounter;