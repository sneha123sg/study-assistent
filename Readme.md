# StudyFlow

> **AI-powered active learning assistant that converts any topic into personalized flashcards, quizzes, explanations, and mistake reviews.**

## Overview

StudyFlow is a full-stack AI learning application designed around **active recall and self-assessment**.

A user enters a topic and selects a difficulty level. StudyFlow uses the **Gemini API** to generate a structured study pack containing:

* Topic summary
* Key concepts
* Custom number of flashcards
* Custom number of MCQ quiz questions
* Explanations for quiz answers
* Detailed AI-powered explanations through the **Elaborate** feature
* Quiz scoring
* Mistake review and retry

The application uses a React frontend and Node.js/Express backend, with AI requests handled securely on the server.

---

# Setup

## Prerequisites

* Node.js 18+
* A Gemini API key

---

## 1. Clone the repository

```bash
git clone https://github.com/sneha123sg/study-assistent.git
```
---

## 2. Install frontend dependencies

```bash
cd frontend

npm install
```

---

## 3. Install backend dependencies

```bash
cd ../backend

npm install
```

The backend uses:

```text
Express
Zod
dotenv
@google/genai
```

---

## 4. Configure Gemini API key

Create:
```text
backend/.env
```
Add:
```env
GEMINI_API_KEY=your_gemini_api_key
PORT=5000
```
---

## 5. Start the backend
From the `backend` directory:
```bash
npm run dev
```
---

## 6. Start the frontend
Open another terminal:
```bash
cd frontend
npm run dev
```

Then open the URL shown by Vite, normally:

```text
http://localhost:5173
```

---

# Technology Stack

| Layer             | Technology      |
| ----------------- | --------------- |
| Frontend          | React           |
| Styling           | CSS             |
| Backend           | Node.js         |
| AI SDK            | `@google/genai` |
| Validation        | Zod             |
| Configuration     | dotenv          |

---


# AI Usage

The AI is responsible for generating:

### Study Pack Generation

```text
User topic
     ↓
Difficulty
     ↓
Requested flashcard count
     ↓
Requested quiz count
     ↓
Gemini
     ↓
Structured JSON
```

The generated study pack contains:

```json
{
  "topic": "...",
  "difficulty": "...",
  "summary": "...",
  "keyPoints": [],
  "flashcards": [],
  "quiz": []
}
```

The application validates this response using **Zod** before displaying it.

---

## AI-generated flashcards

The user can specify how many flashcards they want.

For example:

```text
Topic: Binary Trees

Flashcards: 5
Quiz Questions: 5
```

StudyFlow instructs Gemini to generate **exactly the requested number**.

The backend additionally verifies the generated array length before returning the response to the frontend.

---

## AI-generated quizzes

Each quiz question contains:

```text
Question
4 options
Correct answer
Explanation
```

The backend validates that:

* Exactly four options exist
* `correctAnswer` is a valid index
* An explanation exists
* The requested number of questions was generated

---

## AI-powered Elaborate feature

If a student doesn't understand a quiz explanation, they can click:

```text
✨ Elaborate
```

StudyFlow sends that particular question, its options, the correct answer, and the original explanation back to Gemini.

Gemini returns a structured explanation containing:

```text
Concept
↓
Simple explanation
↓
Why the answer is correct
↓
Why the other options are wrong
↓
Example
↓
Key takeaway
```

This makes the AI behave more like a **tutor** rather than simply a content generator.

---

# Structured AI Output
One of the important design decisions in StudyFlow is that the frontend does **not blindly trust the AI response**.

The flow is:

```text
Gemini
   ↓
JSON response
   ↓
JSON.parse()
   ↓
Zod validation
   ↓
Count validation
   ↓
React UI
```

For example, the backend verifies:

```javascript
validated.flashcards.length === requestedCount
```

and:

```javascript
validated.quiz.length === requestedCount
```

If the AI returns the wrong structure or wrong number of items, the backend returns an error instead of allowing invalid data to reach the frontend.

This prevents malformed AI output from breaking the application.

---

# AI Limitations

StudyFlow relies on an external generative AI model, so the following limitations apply.

### 1. AI-generated content may occasionally be inaccurate

Although prompts request technically accurate content, generative AI can still produce incorrect or incomplete information.

StudyFlow therefore treats AI output as **study assistance**, not an authoritative source.
---

### 2. Exact item counts are enforced by the application
The application asks Gemini for the requested number of items.
However, AI models can occasionally return an unexpected structure.  
Therefore StudyFlow validates the response using Zod and performs additional count checks.  
If validation fails, the user receives an error instead of seeing incomplete data.

---

### 3. API availability and rate limits
The application depends on the Gemini API being available.
API limits can affect:
* Request frequency
* Response time
* Availability
* Usage capacity

Gemini's API limits depend on the account/project and selected tier. 
---

### 4. Internet connection required
Since AI generation happens through the Gemini API, generating new study packs and elaborations requires an active internet connection.

---

### 5. Response latency
Generation time depends on:
* Model selected
* Prompt size
* Number of flashcards
* Number of quiz questions
* API load
* Network latency

---

## Time Spent
```text
Approximate development time: 8 hours
```
---

# Key Features
### Study Generation
* Custom topic
* Difficulty selection
* Custom flashcard count
* Custom quiz count
* AI-generated summary
* AI-generated key points

### Flashcards

* Interactive flip animation
* Question/answer format
* Previous/next navigation

### Quiz

* Multiple-choice questions
* Four options per question
* Immediate answer feedback
* Score calculation
* Explanations

### AI Tutor

* **Elaborate** button
* Concept explanation
* Simple explanation
* Explanation of correct answer
* Explanation of incorrect options
* Practical example
* Key takeaway

### Mistake Review

* Tracks incorrect questions
* Allows the user to retry mistakes
* Provides another opportunity for active recall

---
