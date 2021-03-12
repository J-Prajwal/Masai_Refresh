import React, { useState } from "react";
import { Grid, FormControl, RadioGroup } from "@material-ui/core";
import { OptionRadio } from "./OptionRadio";
import { useDispatch, useSelector } from "react-redux";
import { nextQuestion, recordAnswer } from "../State/action";
import Button from "@material-ui/core/Button";
import ReactMarkdown from "react-markdown";
import { SyntaxHighlight } from "./SyntaxHighlighter";
import { getResult } from "../../Results Display/State/action";
import { useHistory } from "react-router";

const MCQ = ({ data, lastQuestion }) => {

  const { statement, options } = data;
  const [value, setValue] = useState(-1);
  const dispatch = useDispatch();
  const history = useHistory();
  const { attemptId, submissionId } = useSelector((state) => state.topics);

  const handleRadioChange = async(e) => {
    await setValue(e.target.value);
    answerRecordSetup()
  };

  const getNextQuestion = () => {
    dispatch(nextQuestion({attemptId, submissionId}))
  };

  const answerRecordSetup = async() => {
    let payload = {
      attempt_id: attemptId,
      submission_id: submissionId,
      answer_type: "MCQ",
      selected: Number(value),
    };
    await dispatch(recordAnswer(payload));
  }

  const submitAnswers = async() => {
    await dispatch(getResult(attemptId));
    history.push("/results_display");
  };

  return (
    <div>
      <ReactMarkdown renderers={{ code: SyntaxHighlight }}>
        {statement}
      </ReactMarkdown>
      <form>
        <FormControl fullWidth component="fieldset">
          <RadioGroup
            aria-label="quiz"
            name="quiz"
            value={Number(value)}
            onChange={handleRadioChange}
          >
            <Grid
              direction="row"
              justify="flex-start"
              alignItems="flex-start"
              container
            >
              {options.map((option, index) => (
                <OptionRadio
                  id={Number(index + 1)}
                  // value={option.text}
                  value={<ReactMarkdown>{option.text}</ReactMarkdown>}
                  key={index}
                />
              ))}
            </Grid>
          </RadioGroup>
        </FormControl>
      </form>
      {lastQuestion === data.id ? (
        <Button onClick={submitAnswers} variant="contained" color="primary">
          Submit
        </Button>
      ) : (
        <Button onClick={getNextQuestion} variant="contained" color="secondary">
          Next
        </Button>
      )}
    </div>
  );
};

export { MCQ };
