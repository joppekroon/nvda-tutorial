// Activate immediately, no need to wait for second visit.
self.skipWaiting();

class Answers {
  static ANSWER_KEY = [
    {
      key: "Q1",
      title: "Question 1: Which is the third list item?",
      explanation: "The order of the items has been changed in CSS, but the screen reader only looks at the order in the HTML.",
      solution: "cat",
    },
    {
      key: "Q2",
      title: "Question 2: What is the last list item?",
      explanation: "The last list item and radio button have been visually hidden, but they are visible to the screen reader.",
      solution: "wagon",
    },
    {
      key: "Q3",
      title: "Question3: What is a string instrument?",
      explanation: "The labels of the radio buttons have been replaced with definitions of types of instruments using <code>aria-label</code> and <code>aria-hidden</code>. The list of items is just a decoy.",
      solution: "string",
    },
    {
      key: "Q4",
      title: "Question4: Which image is the red brick?",
      explanation: "The alt texts do not match the pictures, one image is even made invisible due to an empty alt attribute.",
      solution: "D",
    },
    {
      key: "Q5",
      title: "Question 5: Follow the fifth link!",
      explanation: "One link has it's underline removed, and some underlined words are not links at all.",
      solution: "dog",
    },
  ];

  constructor() {
    this.answers = {};
  }

  addAnswer(key, answer) {
    if (!Answers.ANSWER_KEY.find(entry => entry.key === key)) {
      console.log('ignoring unknown question');
      return;
    }

    this.answers[key] = answer;
  }

  hasAnswers() {
    return Object.entries(this.answers).length > 0;
  }

  getResults() {
    return Answers.ANSWER_KEY.map(solution => {
      const answer = this.answers[solution.key];

      return {
        title: solution.title,
        explanation: solution.explanation,
        correct: answer === solution.solution,
      };
    })
  }

  clear() {
    this.answers = {};
  }
}

const answers = new Answers();

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  url.searchParams.forEach((value, key) => {
    answers.addAnswer(key, value)
  });

  if (url.pathname.endsWith('question6.html')) {
    event.respondWith(fetch('final.html'));
  }
});

self.addEventListener('message', (event) => {
  if (event.data === 'results') {
    event.source.postMessage({ results: answers.getResults()});
  }
  if (event.data === 'answers') {
    event.source.postMessage({ answers: answers.hasAnswers()});
    return;
  }
  if (event.data === 'reset') {
    answers.clear();
    event.source.postMessage({});
    return;
  }

  event.source.postMessage({ error : `Unrecognized message ${event.data}` });
})