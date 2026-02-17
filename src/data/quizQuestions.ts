export const quizQuestions = [
  {
    id: 'goal',
    question: "What's your primary goal?",
    type: 'single',
    options: [
      { value: 'fatLoss', label: 'Fat Loss', icon: '🔥' },
      { value: 'muscle', label: 'Muscle Growth', icon: '💪' },
      { value: 'healing', label: 'Recovery & Healing', icon: '🩹' },
      { value: 'cognition', label: 'Cognitive Enhancement', icon: '🧠' },
      { value: 'antiAging', label: 'Anti-Aging', icon: '⏳' },
      { value: 'sleep', label: 'Better Sleep', icon: '😴' },
      { value: 'immune', label: 'Immune Support', icon: '🛡️' },
    ],
  },
  {
    id: 'approval',
    question: 'How important is FDA approval?',
    type: 'single',
    options: [
      { value: 'required', label: 'Must have FDA approval' },
      { value: 'preferred', label: 'Nice to have' },
      { value: 'any', label: "Don't care" },
    ],
  },
  {
    id: 'administration',
    question: 'Administration preference?',
    type: 'single',
    options: [
      { value: 'any', label: 'No preference' },
      { value: 'injection', label: 'Injection is fine' },
      { value: 'oral', label: 'Oral only' },
      { value: 'nasal', label: 'Intranasal preferred' },
    ],
  },
  {
    id: 'focus',
    question: 'Pick your top 2 priorities',
    subtitle: 'Select up to 2',
    type: 'multi',
    max: 2,
    options: [
      { value: 'healing', label: 'Healing' },
      { value: 'muscle', label: 'Muscle' },
      { value: 'cognition', label: 'Cognition' },
      { value: 'antiAging', label: 'Anti-Aging' },
      { value: 'fatLoss', label: 'Fat Loss' },
      { value: 'immune', label: 'Immune' },
    ],
  },
];
