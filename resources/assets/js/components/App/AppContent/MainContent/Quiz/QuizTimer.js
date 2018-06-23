import React from 'react';
import { SecsToTime } from '../../../../../utils/AppHelper';

function QuizTimer(props) {
    return (
      <p className="QuizTimer">{SecsToTime(props.pass_time - props.current_sec)}</p>
    );
}

export default QuizTimer;