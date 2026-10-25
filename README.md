# 🚀 3D Developer Portfolio

A modern, animated 3D developer portfolio built with React, Three.js, TailwindCSS, and motion effects — designed to help you stand out and showcase your skills creatively.

![3d Portfolio Screenshot GitHub](https://github.com/user-attachments/assets/9b0ed20e-074e-4f2a-81d8-20c9da751e9e)

---

## 📚 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Assets](#-assets)
- [Contact Me](#-contact-me)
- [Suggestions or Feedback](#-suggestions-or-feedback)
- [Like This Project?](#-like-this-project)

---

## ✨ Features

- 🔥 3D visuals powered by **React Three Fiber** and **Drei**
- ⚡ Smooth transitions and scroll-based animations using **Framer Motion**
- 🎨 Clean, responsive UI with **TailwindCSS**
- 💌 EmailJS contact form (requires the public configuration described below)
- 🚀 Lightning-fast development with **Vite**

---

## 🛠 Tech Stack

| Tech              | Description                           |
|-------------------|---------------------------------------|
| React             | Front-end JavaScript library          |
| Vite              | Fast bundler and dev environment      |
| TailwindCSS       | Utility-first CSS framework           |
| React Three Fiber | 3D rendering with Three.js in React   |
| Drei              | Helpers and abstractions for R3F      |
| Framer Motion     | Animation library for React           |
| EmailJS           | Form handling and email integration   |

---

## 📁 Project Structure

```bash
├── public/
│   ├── assets/             # Images, textures, models
│   ├── models/             # 3D Astronaut model
├── src/
│   ├── components/         # Reusable components
│   ├── constants/          # Reusable datas
│   ├── sections/           # Portfolio sections (Hero, About, etc.)
│   ├── App.jsx             # Main app file
│   ├── index.css           # Tailwind css
│   └── main.jsx            # Entry point
├── tailwind.config.js
└── vite.config.js
```

---

## 🚀 Getting Started
1. Clone the Repository
```bash
git clone https://github.com/Ali-Sanati/Portfolio.git
cd Portfolio
```
2. Install Dependencies
```bash
npm install
```
3. Run the Development Server
```bash
npm run dev
```
The app will be available at http://localhost:5173.

---

## Contact form configuration

Copy `.env.example` to `.env.local` and set the EmailJS service ID, template ID,
and public key. Configure the EmailJS template's recipient as `{{to_email}}`;
the form sends `from_name`, `reply_to`, `message`, and `to_email` (set to
`adamderbali16@gmail.com`). The public key and IDs are intended for client use;
never put an EmailJS private key or other secret in a `VITE_` variable. If the
EmailJS values are not set, submitting the form opens the visitor's email app
with a message addressed to `adamderbali16@gmail.com`.

## Production deployment

This is a single-page Vite application with no client-side router. Run
`npm run build`; the production output is `dist/`. Vercel or Netlify can deploy
the repository using `npm run build` and `dist` as the output directory. Set
the three EmailJS variables in the host's production environment settings.
There are no deep routes that require an SPA rewrite.

---

## 🔗 Assets
Assets used in the project can be found [here](https://github.com/user-attachments/files/19820923/public.zip)

---

## 📬 Contact Me
[GitHub](https://github.com/DerbaliAdem) ·
[LinkedIn](https://www.linkedin.com/in/adem-derbali-3519a9339/) ·
[Facebook](https://www.facebook.com/share/14tmzNnuAJ8/) ·
[Instagram](https://www.instagram.com/adamderbali69?cplk=MTQ0NDBvbzdncGJsZQ==)

---

## 💡 Suggestions or Feedback?
For suggestions or feedback, reach out through one of the social profiles above.

---

## ⭐ Like This Project?
Thanks for visiting.
