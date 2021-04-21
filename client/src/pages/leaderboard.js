import { useQuery } from "react-query";
import { useHistory } from "react-router";
import { Table, Header, Image, Container } from "semantic-ui-react";

import { getUsers } from "../util/api";

import { authContext } from "../context/auth";
import { useContext, useEffect } from "react";

function Leaderboard() {
  const { user } = useContext(authContext);

  const history = useHistory();

  useEffect(() => {
    if (!user) {
      history.push("/login");
    }
  });

  const token = localStorage.getItem("token");

  const { data } = useQuery("users", () => getUsers(token), {
    enabled: !!user,
  });

  return (
    <Container text>
      <Header size="huge">Leaderboard</Header>
      <Table basic="very" celled collapsing>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>User</Table.HeaderCell>
            <Table.HeaderCell>Score</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {data &&
            data.map((user, index) => (
              <Table.Row key={index}>
                <Table.Cell>
                  <Header as="h4" image>
                    <Image
                      src="https://react.semantic-ui.com/images/avatar/small/lena.png"
                      rounded
                      size="mini"
                    />
                    <Header.Content>{user.username}</Header.Content>
                  </Header>
                </Table.Cell>
                <Table.Cell>{user.score}</Table.Cell>
              </Table.Row>
            ))}
        </Table.Body>
      </Table>
    </Container>
  );
}

export default Leaderboard;
