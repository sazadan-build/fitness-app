// Upper/Lower machine and cable-based splits, designed for individuals with
// lower back concerns. All exercises use machines or cables — no free weights.
// Built around major movement patterns (horizontal/vertical press/pull, leg drive,
// hip hinge alternatives).
export const PROGRAM_DAYS = [
  {
    id: 'upper',
    name: 'Upper Body',
    focus: 'Chest / Back / Shoulders',
    exercises: [
      { name: 'Machine Chest Press', targetSets: 4, targetReps: '8-10' },
      { name: 'Machine Lat Pulldown', targetSets: 4, targetReps: '8-10' },
      { name: 'Cable Machine Row (Seated)', targetSets: 3, targetReps: '8-10' },
      { name: 'Machine Shoulder Press', targetSets: 3, targetReps: '8-10' },
      { name: 'Cable Chest Fly', targetSets: 3, targetReps: '10-12' },
      { name: 'Cable Face Pull', targetSets: 3, targetReps: '12-15' },
      { name: 'Cable Lateral Raise', targetSets: 2, targetReps: '12-15' },
    ],
  },
  {
    id: 'lower',
    name: 'Lower Body',
    focus: 'Quads / Hamstrings / Glutes / Core',
    exercises: [
      { name: 'Leg Press Machine', targetSets: 4, targetReps: '8-10' },
      { name: 'Machine Leg Curl', targetSets: 3, targetReps: '10-12' },
      { name: 'Machine Leg Extension', targetSets: 3, targetReps: '10-12' },
      { name: 'Cable Glute Kickback', targetSets: 3, targetReps: '12-15/leg' },
      { name: 'Machine Leg Abduction', targetSets: 2, targetReps: '12-15' },
      { name: 'Machine Leg Adduction', targetSets: 2, targetReps: '12-15' },
      { name: 'Cable Woodchop (Anti-Rotation)', targetSets: 2, targetReps: '12/side' },
    ],
  },
]
