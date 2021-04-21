import React, { useContext, useEffect } from "react";
import Question from "../components/Question";
import { QueryClient, QueryClientProvider } from "react-query";
import { useHistory } from "react-router-dom";
import { Header } from "semantic-ui-react";

import { authContext } from "../context/auth";

const queryClient = new QueryClient();

function Home() {
  const context = useContext(authContext);

  const history = useHistory();

  useEffect(() => {
    if (!context.user) {
      history.push("/login");
    }
  });

  return context.user && context.questionAnswered ? (
    <Header>You already answered today's question. Please come back!</Header>
  ) : (
    <QueryClientProvider client={queryClient}>
      <Question />
    </QueryClientProvider>
  );
}

export default Home;
