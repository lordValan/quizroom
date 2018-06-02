import React from 'react';
import PropTypes from 'prop-types';

function QuestionHead(props) {
    return (
      <h2 className="question-head">{props.content}</h2>
    );
}

QuestionHead.propTypes = {
    content: PropTypes.string.isRequired
};

export default QuestionHead;