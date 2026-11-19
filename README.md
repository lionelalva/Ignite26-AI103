# AI-103 Trainer

A small, dependency-free web app for studying and practicing for **Exam AI-103: Developing AI Apps and Agents on Azure**.

- **Dashboard**: accuracy, attempted/missed counts and per-domain mastery (saved in your browser's localStorage)
- **Study**: the official skills outline plus key points for each of the five domains
- **Flashcards**: shuffle by domain; Space flips, arrows navigate
- **Quiz**: Practice mode (instant feedback) or Exam mode (timed, results at the end), with single and multi-select questions, a "previously missed" drill and a per-domain breakdown

Domain weights follow the Microsoft Learn study guide (skills measured as of April 16, 2026):
Plan and manage (25–30%), Generative AI and agents (30–35%), Computer vision (10–15%), Text analysis (10–15%), Information extraction (10–15%).

## Run it

No build step. Open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8080   # then visit http://localhost:8080
```

## Add or edit questions

Questions live in `questions.js`. Each looks like:

```js
{ id: "d2-17", domain: "d2", objective: "Skill from the study guide",
  multi: false, q: "Question text?", options: ["A", "B", "C", "D"],
  answer: [1], explain: "Why B is right." }
```

Then validate the bank:

```bash
node scripts/validate.js
```

## Host on GitHub Pages

A workflow in `.github/workflows/pages.yml` validates the question bank and deploys the site on every push to `main`. Enable it under **Settings → Pages → Source: GitHub Actions**.

## Notes

These are original practice questions written from the public study guide. They are study aids, not real exam content, and the exam changes over time. Always check the [official study guide](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/ai-103) and Microsoft's free Practice Assessment.
