import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ReferPlace from './refer-place';
import DesiredTasks from './desired-tasks';
import Card from '../../../ui/card';
import { setQuestionnaire } from '../../../service/user.service';

const DESIRED_TASK_STEP = 'desired-tasks';
const REFER_PLACE_STEP = 'refer-place';
const DESIRED_TASK_TITLE = 'What tasks would you prefer to do on the HUMAN App?';
const REFER_PLACE_TITLE = 'How did you get to know about the Human Protocol?';

export default function Questionnaire({ styles, userId, authToken, onSubmit }) {
  const [step, setStep] = useState(DESIRED_TASK_STEP);
  const [tasks, setTasks] = useState([]);
  const submitTasks = (submittedTasks) => {
    setTasks(submittedTasks);
    setStep(REFER_PLACE_STEP);
  };
  const submitReferPlace = (submittedReferPlace) =>
    setQuestionnaire(
      userId,
      DESIRED_TASK_TITLE,
      tasks,
      REFER_PLACE_TITLE,
      submittedReferPlace,
      authToken,
    ).then(onSubmit);
  return (
    <Card styles={styles}>
      {step === DESIRED_TASK_STEP && (
        <DesiredTasks onSubmit={submitTasks} title={DESIRED_TASK_TITLE} />
      )}
      {step === REFER_PLACE_STEP && (
        <ReferPlace onSubmit={submitReferPlace} title={REFER_PLACE_TITLE} />
      )}
    </Card>
  );
}

Questionnaire.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  styles: PropTypes.any,
  userId: PropTypes.string,
  authToken: PropTypes.string,
  onSubmit: PropTypes.func.isRequired,
};

Questionnaire.defaultProps = {
  styles: {},
  userId: '',
  authToken: '',
};
