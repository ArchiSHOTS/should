export interface Quote {
  text: string;
  author: string;
}

export const QUOTES: Quote[] = [
  // Marcus Aurelius
  {
    text: "You have power over your mind, not outside events. Realize this, and you will find strength.",
    author: "Marcus Aurelius",
  },
  {
    text: "If it is not right, do not do it; if it is not true, do not say it.",
    author: "Marcus Aurelius",
  },
  {
    text: "The best revenge is to be unlike him who performed the injustice.",
    author: "Marcus Aurelius",
  },
  {
    text: "Waste no more time arguing about what a good man should be. Be one.",
    author: "Marcus Aurelius",
  },
  {
    text: "Everything we hear is an opinion, not a fact. Everything we see is a perspective, not the truth.",
    author: "Marcus Aurelius",
  },
  {
    text: "The impediment to action advances action. What stands in the way becomes the way.",
    author: "Marcus Aurelius",
  },
  {
    text: "When you wake up in the morning, tell yourself: the people I deal with today will be meddling, ungrateful, arrogant, dishonest, jealous and surly... but I have seen the beauty of good, and the ugliness of evil.",
    author: "Marcus Aurelius",
  },

  // Epictetus
  {
    text: "It's not what happens to you, but how you react to it that matters.",
    author: "Epictetus",
  },
  {
    text: "Make the best use of what is in your power, and take the rest as it happens.",
    author: "Epictetus",
  },
  {
    text: "Seek not the good in external things; seek it in yourselves.",
    author: "Epictetus",
  },
  {
    text: "First say to yourself what you would be; and then do what you have to do.",
    author: "Epictetus",
  },
  {
    text: "He who laughs at himself never runs out of things to laugh at.",
    author: "Epictetus",
  },
  {
    text: "No man is free who is not master of himself.",
    author: "Epictetus",
  },
  {
    text: "We have two ears and one mouth so that we can listen twice as much as we speak.",
    author: "Epictetus",
  },

  // Seneca
  {
    text: "We suffer more often in imagination than in reality.",
    author: "Seneca",
  },
  {
    text: "Anger is an acid that can do more harm to the vessel in which it is stored than to anything on which it is poured.",
    author: "Seneca",
  },
  {
    text: "Difficulties strengthen the mind, as labor does the body.",
    author: "Seneca",
  },
  {
    text: "The first step: don't be anxious. Nature controls it all.",
    author: "Seneca",
  },
  {
    text: "Begin at once to live, and count each separate day as a separate life.",
    author: "Seneca",
  },
  {
    text: "He who is brave is free.",
    author: "Seneca",
  },

  // Rumi
  {
    text: "Out beyond ideas of wrongdoing and rightdoing, there is a field. I'll meet you there.",
    author: "Rumi",
  },
  {
    text: "Yesterday I was clever, so I wanted to change the world. Today I am wise, so I am changing myself.",
    author: "Rumi",
  },
  {
    text: "Silence is the language of God; all else is poor translation.",
    author: "Rumi",
  },
  {
    text: "The wound is the place where the Light enters you.",
    author: "Rumi",
  },

  // Thich Nhat Hanh
  {
    text: "Feelings come and go like clouds in a windy sky. Conscious breathing is my anchor.",
    author: "Thich Nhat Hanh",
  },
  {
    text: "Because you are alive, everything is possible.",
    author: "Thich Nhat Hanh",
  },
  {
    text: "To think in terms of either pessimism or optimism oversimplifies the truth. The problem is to see reality as it is.",
    author: "Thich Nhat Hanh",
  },
  {
    text: "The present moment is the only moment available to us, and it is the door to all moments.",
    author: "Thich Nhat Hanh",
  },

  // Viktor Frankl
  {
    text: "Between stimulus and response there is a space. In that space is our power to choose our response.",
    author: "Viktor Frankl",
  },
  {
    text: "When we are no longer able to change a situation, we are challenged to change ourselves.",
    author: "Viktor Frankl",
  },

  // Lao Tzu
  {
    text: "He who knows others is wise; he who knows himself is enlightened.",
    author: "Lao Tzu",
  },
  {
    text: "Nature does not hurry, yet everything is accomplished.",
    author: "Lao Tzu",
  },
  {
    text: "Watch your thoughts, they become your words; watch your words, they become your actions.",
    author: "Lao Tzu",
  },

  // Stoic general
  {
    text: "Do not indulge in expectations or the impulses of anger, which will lead to sorrow.",
    author: "Zeno of Citium",
  },
  {
    text: "The secret of success is learning how to use pain and pleasure instead of having pain and pleasure use you.",
    author: "Tony Robbins",
  },
];

export function getRandomQuote(): Quote {
  return QUOTES[Math.floor(Math.random() * QUOTES.length)];
}
