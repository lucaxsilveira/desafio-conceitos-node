const express = require("express");
const cors = require("cors");
const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

/**
 * MIDDLEWARE
 */
function validateRepositoryUUID(request, response, next){
  const { id } = request.params
  if (!isUuid(id)){
    return response.status(400).json({ error: "This project id is not valid."})
  }
  return next()
}

function validateRepositoryId(request, response, next){
  const { id } = request.params
  /** find repo index */
  const index = repositories.findIndex(repository => repository.id === id)
  if (index < 0) {
      return response.status(400).json({ error: `Repository not found ${id}`})
  }

  request.repoIndex = index
  return next()
}

/** validate all id's */
app.use("/repositories/:id", validateRepositoryUUID, validateRepositoryId)
/** END MIDDLEWARE */

var repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body
  const id = uuid()
  const project = {
    id,
    title,
    techs,
    url,
    likes: 0
  }

  repositories.push(project);
  return response.json(project)
});

app.put("/repositories/:id", (request, response) => {
  const { title, url, techs } = request.body
  const index = request.repoIndex
  const foundRepository = repositories[index]

  const repository = {
    title,
    url,
    techs,
    id: foundRepository.id,
    likes: foundRepository.likes
  }
  /** replace old repo */
  repositories[index] = repository
  return response.json(repository)
});

app.delete("/repositories/:id", (request, response) => {
  const index = request.repoIndex
  repositories.splice(index, 1)

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const index = request.repoIndex
  repositories[index].likes += 1
  return response.json(repositories[index])
});

module.exports = app;
