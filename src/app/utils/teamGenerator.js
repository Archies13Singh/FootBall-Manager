import Team from "../models/Team";


const PLAYER_NAMES = [
  "John Smith", "David Jones", "Michael Brown", "James Wilson", "Robert Taylor",
  "William Anderson", "Joseph Thomas", "Charles Jackson", "Thomas White", "Christopher Harris",
  "Daniel Martin", "Matthew Thompson", "Anthony Garcia", "Mark Martinez", "Donald Robinson",
  "Steven Clark", "Paul Rodriguez", "Andrew Lewis", "Kevin Lee", "Brian Walker"
];

// Ensure generateUniquePlayer returns correctly formatted player objects
const generateUniquePlayer = (usedNames, position) => {
  let randomName;
  do {
    randomName = PLAYER_NAMES[Math.floor(Math.random() * PLAYER_NAMES.length)];
  } while (usedNames.has(randomName));
  usedNames.add(randomName);

  return {
    name: randomName,
    position,
    value: Math.floor(Math.random() * 1000000) + 500000,
    stats: {
      attack: Math.floor(Math.random() * 100),
      defense: Math.floor(Math.random() * 100),
      speed: Math.floor(Math.random() * 100),
    },
  };
};


export const createTeam = async (userId) => {
  try {
    const usedNames = new Set();
    const players = [
      ...Array(3).fill().map(() => generateUniquePlayer(usedNames, 'GK')),
      ...Array(6).fill().map(() => generateUniquePlayer(usedNames, 'DEF')),
      ...Array(6).fill().map(() => generateUniquePlayer(usedNames, 'MID')),
      ...Array(5).fill().map(() => generateUniquePlayer(usedNames, 'ATT'))
    ];

    console.log("Creating team with data:", {
      name: `Team ${userId}`,
      owner: `${userId}`,
      budget: 5000000,
      players,
    },"complete team");

    const team = await Team.create({
      name: `Team ${userId}`,
      owner: `${userId}`,
      budget: 5000000,
      players,
    });

    console.log("Team successfully created:", team);
    return team;
  } catch (error) {
    console.error("Error creating team:", error.message);
    throw new Error("Could not create team. Please try again.");
  }
};
