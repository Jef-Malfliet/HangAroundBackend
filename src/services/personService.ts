import { Router } from "express";
import models from "../models";

const routes = Router();

//#region GET
routes.get("/getPersons", async (req, res) => {
  const persons = await models.person.model
    .find({})
    .catch((e) => res.status(400).send({ error: e }));
  res.send(persons);
});

routes.get("/getPersonById", async (req, res) => {
  const person = await models.person.model
    .find({ _id: req.query.id })
    .catch((e) => res.status(400).send({ error: e }));
  res.send(person);
});

routes.get("/getPersonByName", async (req, res) => {
  const person = await models.person.model
    .find({ name: req.query.name })
    .catch((e) => res.status(400).send({ error: e }));
  res.send(person);
});

routes.get("/getPersonsInActivity", async (req, res) => {
  const activity = await models.activity.model.findById({ _id: req.query.id });
  const personIds: String[] = [];
  activity.participants.forEach((p) => {
    personIds.push(p.personId);
  });
  const persons = await Promise.all(
    personIds.map(async (id) => {
      return await models.person.model.findById({ _id: id });
    })
  ).catch((e) => res.status(400).send({ error: e }));
  res.send(persons);
});

routes.get("/getFriendsOfPerson", async (req, res) => {
  const person = await models.person.model.findById({ _id: req.query.id });

  const friends = await Promise.all(
    person.friends.map(async (id) => {
      return await models.person.model.findById({ _id: id });
    })
  ).catch((e) => res.status(400).send({ error: e }));
  res.send(friends);
});

routes.get("/getPersonsWithNameLike", async (req, res) => {
  const personsLikeName = await models.person.model
    .find({ name: { $regex: ".*" + req.query.name + ".*" } })
    .catch((e) => res.status(400).send({ error: e }));
  res.status(200).send(personsLikeName);
});
//#endregion

//#region UPDATE
routes.post("/updatePerson", async (req, res) => {
  const updatedperson = await models.person.model
    .findByIdAndUpdate(
      { _id: req.body._id },
      {
        name: req.body.name,
        friends: req.body.friends,
        email: req.body.email,
      },
      { new: true, upsert: true }
    )
    .catch((e) => {
      res.status(400).send({ error: e });
    });
  res.status(200).send([updatedperson]);
});
//#endregion

//#region DELETE
routes.delete("/deletePerson", async (req, res) => {
  await models.person.model
    .findByIdAndDelete({ _id: req.query.id })
    .catch((e) => res.status(400).send({ error: e }));
  res.status(200).send({ id: req.query.id });
});
//#endregion

//#region Management
//check if person exists
routes.get("/checkPersonExists", async (req, res) => {
  if (await models.person.model.findOne({ email: req.query.email })) {
    res.status(200).send(true);
    return;
  }
  res.status(200).send(false);
});

//register
routes.post("/registerPerson", async (req, res) => {
  if (await models.person.model.findOne({ email: req.body.email })) {
    res.status(400).send({ error: "person already exists, try logging in" });
    return;
  }

  const person = await models.person.model
    .create({
      name: req.body.name,
      friends: req.body.friends,
      email: req.body.email,
    })
    .catch((e) => res.status(400).send({ error: e }));

  res.status(201).send([person]);
});

//login
routes.post("/loginPerson", async (req, res) => {
  if (!(await models.person.model.findOne({ email: req.body.email }))) {
    res
      .status(404)
      .send({ error: "person does not exists, try registering first" });
    return;
  }

  const person = await models.person.model.findOne({ email: req.body.email });
  res.status(200).send([person]);
});
//#endregion

export default routes;
