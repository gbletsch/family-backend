import express from "express";

const app = express();
app.use(express.json());

const users = [
  { email: "gui@email.com", name: "Gui" },
  { email: "patty@email.com", name: "Patty" },
  { email: "pame@email.com", name: "Pame" },
  { email: "pipa@email.com", name: "Pipa" },
];

app.get("/users", (request, response) => {
  const name = String(request.query.name);
  console.log("name", name);
  let result = users;
  if (name !== "undefined") {
    result = users.filter((item) => item.name.includes(name));
  }
  return response.json(result);
});

app.get("/users/:email", (request, response) => {
  const email = request.params.email;
  const result = users.filter((item) => item.email === email);
  console.log("result", result);
  return response.json(result[0]);
});

app.post("/users", (request, response) => {
  const data = request.body;
  // const user = {
  //   email: "newuser@email.com",
  //   name: "New User",
  // };

  return response.json(data);
});

app.listen(3333);
