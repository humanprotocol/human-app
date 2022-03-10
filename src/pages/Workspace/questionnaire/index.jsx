import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { startGlobalLoading, finishGlobalLoading } from '../../../store/action';
import ReferPlace from './refer-place';
import DesiredTasks from './desired-tasks';
import Card from '../../../ui/card';
import { setQuestionnaire } from '../../../service/user.service';
import notifier from '../../../service/notify.service';

const DESIRED_TASK_STEP = 'desired-tasks';
const REFER_PLACE_STEP = 'refer-place';
const DESIRED_TASK_TITLE = 'What tasks would you prefer to do on the HUMAN App?';
const REFER_PLACE_TITLE = 'How did you hear about HUMAN Protocol?';

export default function Questionnaire({ styles, userId, authToken, onSubmit }) {
  const [step, setStep] = useState(DESIRED_TASK_STEP);
  const dispatch = useDispatch();
  const [tasks, setTasks] = useState([]);
  const submitTasks = (submittedTasks) => {
    setTasks(submittedTasks);
    setStep(REFER_PLACE_STEP);
  };
  const submitReferPlace = (submittedReferPlace) => {
    dispatch(startGlobalLoading());
    setQuestionnaire(
      userId,
      DESIRED_TASK_TITLE,
      tasks,
      REFER_PLACE_TITLE,
      submittedReferPlace,
      authToken,
    )
      .then(onSubmit)
      .catch((error) => {
        if (error.message) {
          notifier.error(error.message);
        } else {
          notifier.error('Something went wrong, please try again');
        }
      })
      .finally(() => dispatch(finishGlobalLoading()));
  };
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
