import { createRequire } from "module";
import {
  firebaseCreate,
  firebaseRead,
  firebaseUpdate,
  firebaseDelete,
} from "./index.js";

const require = createRequire(import.meta.url);

// server.js
const express = require("express");
const bodyParser = require("body-parser");
const { validationResult } = require("express-validator");
const app = express();

app.use(bodyParser.json());

// CREATE -------------
app.post("/api/create/*", async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty() || req.params[0] == "") {
    return res
      .status(400)
      .json({ errors: errors.array(), message: "Bad request" });
  }
  try {
    const ref = req.params[0];
    const newItem = req.body;

    firebaseCreate(ref, newItem);
    res.json({ message: "Item created successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//READ----------------
app.get("/api/read/*", async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty() || req.params[0] == "") {
    return res
      .status(400)
      .json({ errors: errors.array(), message: "Bad request" });
  }
  try {
    const ref = req.params[0];
    const items = [];
    await firebaseRead(ref).then((val) => {
      items.push(val);
    });

    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//UPDATE--------------
app.put("/api/update/*", async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty() || req.params[0] == "") {
    return res
      .status(400)
      .json({ errors: errors.array(), message: "Bad request" });
  }
  try {
    const ref = req.params[0];
    const newItem = req.body;

    //firebaseCreate(ref, newItem);
    firebaseUpdate(ref, newItem);
    res.json({ message: "Item updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
//DELETE
app.delete("/api/delete/*", async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty() || req.params[0] == "") {
    return res
      .status(400)
      .json({ errors: errors.array(), message: "Bad request" });
  }
  try {
    const ref = req.params[0];
    const message = "";
    res.json({ message: await firebaseDelete(ref) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
