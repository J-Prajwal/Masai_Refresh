import React from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router";
import { IsLoading } from "../Common/IsLoading";
import { TopicChip } from "../Common/TopicChip";
import { MCQ } from "./Components/MCQ";

const Questions = () => {
  const question = useSelector((state) => state.questions.question);
  const questions = useSelector((state) => state.topics.questions);
  const isLoading = useSelector((state) => state.questions.isLoading);
  const lastQuestion = questions[questions.length - 1];
  const params = useParams();
  const topicDisplay = params.topic;
  return (
    <>
      {isLoading ? (
        <IsLoading />
      ) : (
        <div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <TopicChip topicDisplay={topicDisplay} />
          </div>
          {question.type === "MCQ" ? (
            <MCQ data={question} lastQuestion={lastQuestion} />
          ) : (
            "Questions"
          )}
        </div>
      )}
    </>
  );
};

export { Questions };
