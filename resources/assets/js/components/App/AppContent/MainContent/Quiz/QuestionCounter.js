import React from 'react';
import PropTypes from 'prop-types';

function QuestionCounter(props) {
    return (
      <div className="question-counter">
        Question <span>{props.counter}</span> of <span>{props.total}</span>
      </div>
    );
  }

  QuestionCounter.propTypes = {
    counter: PropTypes.number.isRequired,
    total: PropTypes.number.isRequired
  };

  export default QuestionCounter;