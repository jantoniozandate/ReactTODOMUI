import { default as axios } from "axios";
import * as _ from "lodash";

export default async function getTodo() {
  try {
    const result = await axios.get(
      "https://jsonplaceholder.typicode.com/todos"
    );

    const users = await getUsers();
    const todosWithUser = result.data.map((todo) => ({
      ...todo,
      userName: users[todo.userId].length ? users[todo.userId][0].name : "NA"
    }));
    return [todosWithUser, null];
  } catch (error) {
    return [null, error];
  }
}

async function getUsers() {
  const result = await axios.get("https://jsonplaceholder.typicode.com/users");
  const userDict = _.groupBy(result.data, "id");
  return userDict;
}
