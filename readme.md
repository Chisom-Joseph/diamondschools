# 🎓 School Website

A **web application** built using **Node.js**, **Express.js**, and **EJS** templating engine. Designed for educational institutions, the site features essential pages such as a homepage, about page, contact page, and a blog section.

---

## ✨ Features

- **Homepage**:  
  Responsive design with a hero slider, feature sections, and a call-to-action button.
- **About Page**:  
  Information about the institution, including mission statement, history, and team members.
- **Contact Page**:  
  A page with a contact form and address information.
- **Blog Section**:  
  A list of blog posts with titles, dates, and excerpts.

---

## ⚙️ Technologies Used

- **Node.js**: Runtime environment for JavaScript.
- **Express.js**: Web framework for handling routes and HTTP requests.
- **EJS**: Templating engine for rendering dynamic HTML content.
- **CSS**: Styling for the templates.

---

## 📂 Directory Structure

```bash
.
├── assets
│   ├── css      # Stylesheets
│   ├── img      # Images
│   ├── js       # JavaScript files
│   └── ...
├── middlewares
│   └── setSiteSettings.js  # Middleware for site settings
├── routes
│   └── ...                 # Route handlers
├── server.js               # Main server file
├── views
│   ├── pages               # Individual pages
│   │   ├── 404.ejs
│   │   ├── about.ejs
│   │   ├── contact.ejs
│   │   ├── home.ejs
│   │   └── ...
│   └── partials            # Shared components (partials)
│       ├── footer.ejs
│       ├── header.ejs
│       └── ...
├── package.json            # Project dependencies and scripts
└── ...
```

## 🚀 Getting Started

Follow these steps to run the application locally

- **01.**: Clone the Repository:

```bash
git clone git+https://github.com/Chisom-Joseph/diamondschools.git
cd diamondschools
```

- **02.**: Install Dependencies:

```bash
npm install
```

- **03.**: Install Dependencies:

```bash
npm start
```
