import * as level001 from "./001firstProgram.js";
import * as level002 from "./002obtainArtefact.js";
import * as level003 from "./003defuseBomb.js";
import * as level004 from "./004defuseTwoBombs.js";
import * as level005 from "./005practiceHomerun.js";
import * as level006 from "./006climbStairs.js";
import * as level007 from "./007fillTheHoles.js";
import * as level008 from "./008saveTheFlower.js";
import * as level009 from "./009mowTheLawn.js";
import * as level010 from "./010harvestTheField.js";

export const levels = [
  {
    id: "level001",
    name: "First Program",
    level: level001.world,
  },
  {
    id: "level002",
    name: "Obtain Artifact",
    level: level002.world,
  },
  {
    id: "level003",
    name: "Defuse Bomb",
    level: level003.world,
  },
  {
    id: "level004",
    name: "Defuse Two Bomb",
    level: level004.world,
  },
  {
    id: "level005",
    name: "Practice Homerun",
    level: level005.world,
  },
  {
    id: "level006",
    name: "Climb the stairs",
    level: level006.world,
  },
  {
    id: "level007",
    name: "Fill the holes",
    level: level007.world,
  },
  {
    id: "level008",
    name: "Save the flower",
    level: level008.world,
  },
  {
    id: "level009",
    name: "Mow the lawn",
    level: level009.world,
  },
  {
    id: "level010",
    name: "Harvest the field",
    level: level010.world,
  },
];

export const solutions = [
  {
    level: "level001",
    commands: level001.solution,
  },
  {
    level: "level002",
    commands: level002.solution,
  },
  {
    level: "level003",
    commands: level003.solution,
  },
  {
    level: "level004",
    commands: level004.solution,
  },
  {
    level: "level005",
    commands: level005.solution,
  },
  {
    level: "level006",
    commands: level006.solution,
  },
  {
    level: "level007",
    commands: level007.solution,
  },
  {
    level: "level008",
    commands: level008.solution,
  },
  {
    level: "level009",
    commands: level009.solution,
  },
  {
    level: "level010",
    commands: level010.solution,
  },
];
