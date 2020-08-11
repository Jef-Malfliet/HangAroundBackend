import { Router } from "express";
import models from "../models";
import { stringToDate } from "../util";
import { Activity } from "../modules/activity/model";

const routes = Router();

//#region GET
routes.get("/getActivities", async (req, res) => {
  const activities = await models.activity.model
    .find({})
    .catch((e) => res.status(400).send({ error: e }));
  res.send(activities);
});

routes.get("/getActivityById", async (req, res) => {
  const activity = await models.activity.model
    .find({ _id: req.query.id })
    .catch((e) => res.status(400).send({ error: e }));
  res.send(activity);
});

routes.get("/getActivitiesByOwner", async (req, res) => {
  const activities = await models.activity.model
    .find({ owner: req.query.owner })
    .catch((e) => res.status(400).send({ error: e }));
  res.send(activities);
});

routes.get("/getActivitiesContainingPerson", async (req, res) => {
  const activitiesWithPerson = await models.activity.model.find({
    owner: req.query.id,
  });

  const activityMap = new Map<String, Activity>();
  activitiesWithPerson.forEach((activity) => {
    activityMap.set(activity.id, activity);
  });

  const activities = await models.activity.model.find({});
  activities.forEach((activity) => {
    activity.participants.forEach((p) => {
      if (p.personId == req.query.id) {
        activityMap.set(activity.id, activity);
      }
    });
  });
  let valueArray = Array.from(activityMap.values())
  res.send(valueArray);
});
//#endregion

//#region MAKE
routes.post("/makeActivity", async (req, res) => {
  const activity = await models.activity.model
    .create({
      name: req.body.name,
      owner: req.body.owner,
      startDate: stringToDate(req.body.startDate),
      endDate: stringToDate(req.body.endDate),
      place: req.body.place,
      participants: req.body.participants,
      description: req.body.description,
    })
    .catch((e) => res.status(400).send({ error: e }));
  res.status(201).send([activity]);
});
//#endregion

//#region UPDATE
routes.post("/updateActivity", async (req, res) => {
  const updatedActivity = await models.activity.model
    .findByIdAndUpdate(
      { _id: req.body._id },
      {
        name: req.body.name,
        owner: req.body.owner,
        startDate: stringToDate(req.body.startDate),
        endDate: stringToDate(req.body.endDate),
        place: req.body.place,
        participants: req.body.participants,
        description: req.body.description,
      },
      { new: true, upsert: true }
    )
    .catch((e) => res.status(400).send({ error: e }));
  res.status(200).send([updatedActivity]);
});

//delete
routes.delete("/deleteActivity", async (req, res) => {
  const activity = await models.activity.model
    .findById({ _id: req.query.id })
    .catch((e) => res.status(400).send({ error: e }));
  await models.activity.model
    .findByIdAndDelete({ _id: req.query.id })
    .catch((e) => res.status(400).send({ error: e }));
  res.status(201).send([activity]);
});
//#endregion

export default routes;
