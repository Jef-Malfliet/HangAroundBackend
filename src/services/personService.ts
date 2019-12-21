import { Router } from "express";
import models from "../models";
import jwt from "jsonwebtoken";
import { model } from "../modules/person/model";
import * as bcrypt from "bcrypt";

const routes = Router();

//get
routes.get("/getPersons", async (req, res) => {
  const persons = await models.person.model
    .find({})
    .catch(e => res.status(400).send({ error: e }));
  res.send({ persons: persons });
});

routes.get("/getPersonById", async (req, res) => {
  const person = await models.person.model
    .find({ _id: req.query.id })
    .catch(e => res.status(400).send({ error: e }));
  res.send({ persons: person });
});

routes.get("/getPersonByName", async (req, res) => {
  const person = await models.person.model
    .find({ name: req.query.name })
    .catch(e => res.status(400).send({ error: e }));
  res.send(person);
});

routes.get("/getPersonsInActivity", async (req, res) => {
  const activity = await models.activity.model.findById({ _id: req.query.id });
  const personIds: String[] = [];
  activity.participants.forEach(p => {
    personIds.push(p.personId);
  });
  const persons = await Promise.all(
    personIds.map(async id => {
      return await models.person.model.findById({ _id: id });
    })
  ).catch(e => res.status(400).send({ error: e }));
  res.send({ persons: persons });
});

routes.get("/getFriendsOfPerson", async (req, res) => {
  const person = await models.person.model.findById({ _id: req.query.id });
  const friends = await Promise.all(
    person.friends.map(async id => {
      return await models.person.model.findById({ _id: id });
    })
  ).catch(e => res.status(400).send({ error: e }));
  res.send({ persons: friends });
});

//update
routes.post("/updatePerson", async (req, res) => {
  const updatedperson = await models.person.model
    .findByIdAndUpdate(
      { _id: req.body.id },
      {
        name: req.body.name,
        friends: req.body.friends,
        email: req.body.email
      },
      { new: true, upsert: true }
    )
    .catch(e => {
      res.status(400).send({ error: e });
    });
  res.status(201).send({ persons: updatedperson });
});

//delete
routes.delete("/deletePerson", async (req, res) => {
  await models.person.model
    .findByIdAndDelete({ _id: req.query.id })
    .catch(e => res.status(400).send({ error: e }));
  res.status(201).send({ id: req.query.id });
});

//register
routes.post("/registerPerson", async (req, res) => {
  if (await model.findOne({ email: req.body.email })) {
    res.status(400).send({ error: "person already exists, try logging in" });
  }

  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  const personObject = { email: req.body.email, password: hashedPassword };
  const token = jwt.sign(personObject, process.env.JWT_KEY_SECRET, {
    expiresIn: "1h"
  });

  const person = await models.person.model
    .create({
      name: req.body.name,
      friends: req.body.friends,
      email: req.body.email,
      password: hashedPassword
    })
    .catch(e => res.status(400).send({ error: e }));

  res.send(token);
});

//login
routes.post("/loginPerson", async (req, res) => {
  if (!(await model.findOne({ email: req.body.email }))) {
    res
      .status(404)
      .send({ error: "person does not exists, try registering first" });
  }

  const person = await model.findOne({ email: req.body.email });
  const passwordsMatching = await bcrypt.compare(
    req.body.password,
    person.password
  );

  if (!passwordsMatching) {
    res.status(400).send({ error: "password is not correct, try again" });
  }

  const personObject = {
    email: person.email,
    password: person.password
  };
  const token = jwt.sign(personObject, process.env.JWT_KEY_SECRET, {
    expiresIn: "1h"
  });
  res.send(token);
});

export default routes;
