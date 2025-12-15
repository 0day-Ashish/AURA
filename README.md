# AURA (Adamas University Retrieval Assistant)

![AURA Preview](/image.png)

AURA is an intelligent chatbot designed to instantly answer student queries about admissions, courses, fees, faculty, campus services, and more using university-verified information.

## Features

- **Instant Responses**: Get immediate answers to your questions without waiting for email replies.
- **Verified Information**: All data is sourced directly from official university documents and databases.
- **Comprehensive Coverage**:
  - **Admissions**: Eligibility criteria, application deadlines, and procedures.
  - **Courses**: Syllabus details, credit structures, and electives.
  - **Fees**: Tuition breakdowns, scholarship opportunities, and payment schedules.
  - **Faculty**: Contact information and department details.
  - **Campus Services**: Library hours, transport routes, and hostel facilities.
- **24/7 Availability**: Access support anytime, anywhere.

## Getting Started

Follow these steps to download and run AURA on your local machine.

### Prerequisites

- [Node.js](https://nodejs.org/) (v14 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Git](https://git-scm.com/)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/0day-Ashish/adamas-Chatbot.git
   cd adamas-Chatbot
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Configure Environment Variables**
   Create a `.env` file in the root directory and add necessary API keys (e.g., OpenAI API key, Database URL, JWT token).
   ```env
   API_KEY=your_api_key_here
   ```

4. **Run the application**

**Backend**
   ```bash
   activate venv first
   # then
   uvicorn app:app --reload
   ```

   **Frontend**
   ```bash
   npm run dev 
    ```



5. **Access the Chatbot**
   Open your browser and navigate to `http://localhost:3000` (or the port specified in your console).

## Usage

Simply type your query into the chat interface. For example:
- "What is the fee structure for B.Tech CSE?"
- "How do I apply for a scholarship?"
- "Who is the HOD of the Psychology department?"

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request.

## License

[MIT](LICENSE)
