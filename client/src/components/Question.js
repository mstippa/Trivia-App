import React, { useEffect, useState, useContext } from "react";
import { useMutation, useQuery } from "react-query";
import { useHistory } from "react-router";
import {
  Form,
  Container,
  Header,
  Button,
  Message,
  Transition,
} from "semantic-ui-react";

import { answerQuestion, getQuestion } from "../util/api";

import { authContext } from "../context/auth";

const followUpQuestionRespones = [
  "I knew the answer",
  "I made an educated guess",
  "I made a random guess",
];

function randomizeAnswers(correctAnswer, incorrectAnswers = []) {
  const combinedAnswers = [...incorrectAnswers, correctAnswer];

  for (let i = combinedAnswers.length - 1; i > 0; i--) {
    // random index from 0 to i
    let randomIndex = Math.floor(Math.random() * (i + 1));

    [combinedAnswers[i], combinedAnswers[randomIndex]] = [
      combinedAnswers[randomIndex],
      combinedAnswers[i],
    ];
  }

  return combinedAnswers;
}

function Question() {
  const token = localStorage.getItem("token");

  const history = useHistory();

  const { user, setToken } = useContext(authContext);

  const [skip, setSkip] = useState(true);
  const [selectedAnswer, setSelectedAnswer] = useState();
  const [triviaQuestionAnswered, setTriviaQuestionAnswered] = useState(false);

  const { isLoading, error, data } = useQuery(
    "question",
    () => getQuestion(token, user.currentQuestionId),
    { enabled: skip }
  );

  useEffect(() => {
    if (!!data) setSkip(false);
  }, [data, skip, isLoading, error, selectedAnswer]);

  const mutation = useMutation((userResponse) =>
    answerQuestion(token, userResponse)
  );

  const onSubmit = (event) => {
    event.preventDefault();

    // if the trivia question has not been answered yet
    if (!triviaQuestionAnswered) {
      mutation.mutate(
        { answer: selectedAnswer, id: data._id },
        {
          onSuccess: ({ newToken }) => {
            // set token on local storage because we need browser to rememeber that we
            // answered the daily trivia question
            setToken(newToken);
          },
        }
      );
      setTriviaQuestionAnswered(true);

      // if the trivia question was answered we want to post the answer to the follow up question
    } else {
      mutation.reset();
      mutation.mutate(
        {
          questionId: data._id,
          knewAnswer: selectedAnswer === "I knew the answer",
          educatedGuess: selectedAnswer === "I made an educated guess",
          randomGuess: selectedAnswer === "I made a random guess",
          correct: !!mutation.data.correct,
          answeredQuestion: true,
        },
        {
          onSuccess: () => {
            history.push("/leaderboard");
          },
        }
      );
    }
  };

  const onChange = (event) => {
    setSelectedAnswer(event.target.value);
  };

  // only randomize answers when answers are fetched initially
  if (skip && !isLoading) {
    data.randomizedAnswers = randomizeAnswers(
      data.correctAnswer,
      data.incorrectAnswers
    );
  }

  return (
    <Container text>
      <Form onSubmit={onSubmit}>
        {!!mutation.data ? (
          <Transition.Group>
            {!!mutation.data.correct ? (
              <Form.Group grouped>
                {followUpQuestionRespones.map((response, index) => (
                  <Form.Field
                    label={response}
                    control="input"
                    type="radio"
                    key={index}
                    name="htmlRadios"
                    value={response}
                  />
                ))}
                <Button type="submit" primary>
                  Submit
                </Button>
              </Form.Group>
            ) : (
              <Header>
                You were wrong! The correct answer was:{" "}
                {mutation.data.correctAnswer}
              </Header>
            )}
          </Transition.Group>
        ) : (
          <Transition.Group>
            <Form.Group grouped>
              {data && <Header as="h1">{data.text}</Header>}
              {data &&
                data.randomizedAnswers &&
                data.randomizedAnswers.map((answer, index) => (
                  <Form.Field
                    label={answer}
                    value={answer}
                    onChange={onChange}
                    key={index}
                    control="input"
                    type="radio"
                    name="htmlRadios"
                  />
                ))}
              <Button type="submit" primary>
                Submit
              </Button>
            </Form.Group>
          </Transition.Group>
        )}
        <Message error content="Could not submit answer. Please try again." />
      </Form>
    </Container>
  );
}

export default Question;
