export type Question = { title: string; options: string[]; correct: number };
export type Challenge = {
  id: string;
  title: string;
  category: string;
  description: string;
  points: number;
  difficulty: string;
  duration: string;
  locations: number[];
  articles: number[];
  questions: Question[];
  badge: string;
};
export const challenges: Challenge[] = [
  {
    id: 'explorer',
    title: 'Ocean Explorer',
    category: 'Exploration',
    description:
      'Discover the Ocean Tunnel, Coral Reef Gallery and Deep Sea Observatory using the Dive Map.',
    points: 100,
    difficulty: 'Easy',
    duration: '10–15 min',
    locations: [5, 6, 7],
    articles: [],
    questions: [],
    badge: 'Reef Explorer',
  },
  {
    id: 'knowledge',
    title: 'Diving Knowledge Master',
    category: 'Knowledge',
    description:
      'Test your understanding of diving equipment and underwater safety.',
    points: 150,
    difficulty: 'Medium',
    duration: '5–8 min',
    locations: [],
    articles: [],
    badge: 'Diving Knowledge Master',
    questions: [
      {
        title: 'What is the primary purpose of a scuba regulator?',
        options: [
          'To measure underwater depth',
          'To deliver breathable gas at ambient pressure',
          'To increase swimming speed',
          'To illuminate underwater objects',
        ],
        correct: 1,
      },
      {
        title: 'Which equipment helps a scuba diver control buoyancy?',
        options: [
          'Diving mask',
          'Underwater camera',
          'Buoyancy Control Device',
          'Dive compass',
        ],
        correct: 2,
      },
      {
        title: 'What does a raised thumb generally signal during scuba diving?',
        options: [
          'Everything is fine',
          'Descend deeper',
          'Ascend or end the dive',
          'Swim faster',
        ],
        correct: 2,
      },
      {
        title:
          'Why should diving equipment be checked before entering the water?',
        options: [
          'To make it look cleaner',
          'To verify correct operation and identify problems',
          'To increase water temperature',
          'To reduce cylinder weight',
        ],
        correct: 1,
      },
      {
        title:
          'Which instrument helps divers monitor depth and dive-related information?',
        options: [
          'Underwater torch',
          'Diving fins',
          'Dive computer',
          'Snorkel',
        ],
        correct: 2,
      },
    ],
  },
  {
    id: 'coral',
    title: 'Coral Guardian',
    category: 'Knowledge',
    description:
      'Explore the Coral Reef Gallery and complete the reef conservation quiz.',
    points: 120,
    difficulty: 'Medium',
    duration: '5–8 min',
    locations: [6],
    articles: [],
    badge: 'Coral Guardian',
    questions: [
      {
        title: 'What are coral reefs primarily built by?',
        options: [
          'Underwater plants',
          'Coral polyps',
          'Ocean currents',
          'Sea turtles',
        ],
        correct: 1,
      },
      {
        title: 'Which environmental change can cause coral bleaching?',
        options: [
          'Rising water temperatures',
          'Increased moonlight',
          'Ocean tides alone',
          'Strong underwater sounds',
        ],
        correct: 0,
      },
      {
        title: 'Why are coral reefs important?',
        options: [
          'They eliminate currents',
          'They provide habitats for many species',
          'They prevent all storms',
          'They produce ocean salt',
        ],
        correct: 1,
      },
      {
        title: 'Which action helps protect coral reefs?',
        options: [
          'Touching coral',
          'Collecting fragments',
          'Avoiding physical contact with coral',
          'Feeding wild fish',
        ],
        correct: 2,
      },
      {
        title: 'What is a major threat to reefs?',
        options: [
          'Conservation programs',
          'Ocean warming',
          'Responsible photography',
          'Protected marine areas',
        ],
        correct: 1,
      },
    ],
  },
  {
    id: 'detective',
    title: 'Deep Sea Detective',
    category: 'Discovery',
    description:
      'Read three ocean discoveries and answer the deep-sea questions.',
    points: 180,
    difficulty: 'Hard',
    duration: '10–15 min',
    locations: [],
    articles: [1, 3, 4],
    badge: 'Deep Sea Detective',
    questions: [
      {
        title: 'Why do some deep-sea animals produce light?',
        options: [
          'To warm the water',
          'To communicate, attract prey or avoid predators',
          'To create currents',
          'To produce oxygen',
        ],
        correct: 1,
      },
      {
        title: 'What is the deepest known ocean trench?',
        options: [
          'Puerto Rico Trench',
          'Java Trench',
          'Mariana Trench',
          'Peru–Chile Trench',
        ],
        correct: 2,
      },
      {
        title: 'What is a hydrothermal vent?',
        options: [
          'Underwater coral',
          'A seafloor opening releasing heated, mineral-rich fluids',
          'An ice habitat',
          'A wave-measuring device',
        ],
        correct: 1,
      },
    ],
  },
  {
    id: 'navigator',
    title: 'Festival Navigator',
    category: 'Exploration',
    description:
      'Discover the entrance, diving pool, ocean tunnel, academy and information hub.',
    points: 100,
    difficulty: 'Easy',
    duration: '10–20 min',
    locations: [17, 1, 5, 9, 18],
    articles: [],
    questions: [],
    badge: 'Festival Adventurer',
  },
];
