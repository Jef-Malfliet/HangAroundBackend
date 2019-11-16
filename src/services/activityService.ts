import { Router } from "express";
import models from "../models";
import { stringToDate } from "../util";

const routes = Router();

//get
routes.get("/getActivities", async (req, res) => {
  const activities = await models.activity.model
    .find({})
    .catch(e => res.status(400).send({ error: e }));
  res.send(activities);
});

routes.get("/getActivityById", async (req, res) => {
  const activity = await models.activity.model
    .find({ _id: req.query.id })
    .catch(e => res.status(400).send({ error: e }));
  res.send(activity);
});

routes.get("/getActivitiesByOwner", async (req, res) => {
  const activities = await models.activity.model
    .find({ owner: req.query.owner })
    .catch(e => res.status(400).send({ error: e }));
  res.send(activities);
});

//make
routes.post("/makeActivity", async (req, res) => {
  const activity = await models.activity.model
    .create({
      name: req.body.name,
      owner: req.body.owner,
      startDate: stringToDate(req.body.startDate),
      endDate: stringToDate(req.body.endDate),
      place: req.body.place,
      participants: req.body.participants,
      description: req.body.description
    })
    .catch(e => res.status(400).send({ error: e }));
  res.status(201).send(activity);
});

//update
routes.post("/updateActivity", async (req, res) => {
  const updatedActivity = await models.activity.model
    .findByIdAndUpdate(
      { _id: req.body.id },
      {
        name: req.body.name,
        owner: req.body.owner,
        startDate: stringToDate(req.body.startDate),
        endDate: stringToDate(req.body.endDate),
        place: req.body.place,
        participants: req.body.participants,
        description: req.body.description
      },
      { new: true, upsert: true }
    )
    .catch(e => res.status(400).send({ error: e }));
  res.status(201).send(updatedActivity);
});

//delete
routes.delete("/deleteActivity", async (req, res) => {
  await models.activity.model
    .findByIdAndDelete({ _id: req.query.id })
    .catch(e => res.status(400).send({ error: e }));
  res.send({ id: req.query.id });
});

export default routes;
