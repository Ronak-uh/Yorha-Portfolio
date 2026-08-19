YoRHa OS: Interactive Developer Portfolio
A Nier: Automata inspired interactive web portfolio for Ronak Chavhan, built to showcase software development projects and technical capabilities through an immersive, gamified user experience.

This project goes beyond a standard static resume by placing the user inside a YoRHa terminal. It features functional mini-games, dynamic cursor tracking, audio feedback, and hidden Easter eggs, balanced with accessibility toggles for a professional viewing experience.

Core Features
Immersive Boot Sequence: A cinematic, Linux-style terminal boot-up sequence complete with mechanical audio, system log generation, and progress bars.

Thematic UI & Custom Cursor: A highly stylized interface mimicking the Nier: Automata menus, featuring a custom targeting crosshair, CRT scanline overlays, and custom glitch hover effects.

Autonomous Pod Companion: A pure CSS/React animated geometric "Pod" that autonomously roams the screen and dynamically locks onto hovered interactive elements.

Hacking Minigame: A custom HTML5 Canvas twin-stick shooter hidden within the "Data Archives" tab to "decrypt" classified project files.

Recruiter (Safe) Mode: An accessible top-left toggle saved to localStorage that instantly disables all sounds, cursors, and boot animations for a frictionless reading experience.

Hidden Logs & Self-Destruct: Easter eggs triggered by specific interactions, including a 5-spacebar system overload and classified personal logs.

🛠 Tech Stack
Frontend Framework: React.js

Styling: Tailwind CSS

Game Engine: HTML5 Canvas (Native API)

Background Animations: React Bits (ShapeGrid)

Installation & Setup
Clone the repository:

Bash
git clone https://github.com/Ronak-uh/yorha-portfolio.git
cd yorha-portfolio
Install dependencies:

Bash
npm install
Run the development server:

Bash
npm run dev


System Secrets (Easter Eggs) :
Classified Data: Navigate to DATA_ARCHIVES and engage the encryption protocol to play the hacking minigame.

Override Access: Click the UNIT: R.CHAVHAN text in the sidebar to bypass security and reveal hidden personal data files.

Black Box Overload: Press SPACEBAR 5 times rapidly while on the main screen. (Warning: Proceed at your own risk).