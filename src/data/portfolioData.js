export const portfolioData = {
  personal: {
    name: 'Pavan Kalyan Ram Vanama',
    shortName: 'PKR',
    roles: ['Generative AI', 'Agentic AI', 'ML'],
    roleLine: 'Generative AI | Agentic AI | ML',
    phone: '9059114665',
    phoneFormatted: '+91 905911 4665',
    email: 'vpkram78@gmail.com',
    github: 'https://github.com/Vpkram',
    githubDisplay: 'github.com/Vpkram',
    linkedin: 'https://www.linkedin.com/in/vanama-pavan-kalyan-ram-24a79034b',
    resumeUrl: '/resume.pdf',
    formspreeEndpoint: 'https://formspree.io/f/xppqjvqn',
  },

  about: {
    summary:
      'I am a Computer Science and Engineering undergraduate at Annamacharya University with a strong interest in Artificial Intelligence, Generative AI, and Machine Learning.',
    summary2:
      'I enjoy transforming ideas into practical AI applications through Python, LLMs, machine learning algorithms, and intelligent automation.',
    highlightsHeading: "What I've Been Working On",
    highlights: [
      'Developed an Autonomous Code Review and Bug Fix Agent using Groq API and Llama 3.3 70B.',
      'Built Machine Learning and NLP pipelines for Credit Card Fraud Detection and Spam Mail Prediction.',
      'Explored Genetic Algorithms and multi-generation optimization techniques.',
      'Actively contribute to community initiatives through volunteering, mentoring, and knowledge sharing.',
    ],
    goal: 'My Goal: To build intelligent, scalable AI solutions that solve real-world problems.',
  },

  skills: [
    {
      category: 'Languages',
      items: ['Python', 'Java', 'SQL', 'C'],
    },
    {
      category: 'ML / AI Tools',
      items: [
        'Scikit-learn',
        'Pandas',
        'NumPy',
        'Matplotlib',
        'Seaborn',
        'Groq API',
        'LLaMA 3.3-70b',
        'Genetic Algorithms',
      ],
    },
    {
      category: 'Web Development',
      items: ['HTML', 'CSS', 'JavaScript'],
    },
    {
      category: 'Developer Tools',
      items: ['VS Code', 'GitHub', 'Google Colab', 'LeetCode', 'HackerRank'],
    },
    {
      category: 'Core Subjects',
      items: ['Machine Learning', 'DSA'],
    },
  ],

  experience: [
    {
      role: 'Gen AI & Agentic AI Intern',
      company: 'BrainOvision Solutions Pvt. Ltd.',
      period: 'May 2026 – Jul 2026',
      points: [
        'Gained hands-on experience in Generative AI and Agentic AI system design',
        'Built an Autonomous Code Review & Bug Fix Agent using Groq API and LLaMA 3.3-70b',
        'Applied Genetic Algorithm concepts for automated fix evolution across generations',
      ],
    },
  ],

  projects: [
    {
      title: 'Autonomous Code Review & Bug Fix Agent',
      tech: ['Python', 'Groq API', 'LLaMA 3.3-70b', 'Streamlit', 'Genetic Algorithm'],
      category: 'Agentic AI',
      points: [
        'Built an agentic AI system using LLaMA 3.3-70b via Groq API to detect code bugs and evolve fixes with a custom Genetic Algorithm across 3 generations',
        'Implemented memory-based fix recall, syntax validation with diff generation, and PDF report automation; deployed as an interactive Streamlit web app',
      ],
      githubUrl: 'https://github.com/Vpkram/autonomous-code-review-bug-detector',
    },
    {
      title: 'Credit Card Fraud Detection',
      tech: ['Python', 'Scikit-learn', 'Pandas', 'NumPy', 'Machine Learning'],
      category: 'Machine Learning',
      points: [
        'Built a fraud detection model using Logistic Regression on 284,807 transactions, handling imbalanced data with Random Under-Sampling; applied preprocessing, feature scaling and normalization',
        'Evaluated model using accuracy, precision and recall metrics on Google Colab with Kaggle dataset containing PCA-transformed features',
      ],
      githubUrl: 'https://github.com/Vpkram/Credit-Card-Fraud-Detection',
    },
    {
      title: 'Spam Mail Prediction',
      tech: ['Python', 'Scikit-learn', 'NLP', 'TF-IDF', 'Logistic Regression'],
      category: 'Machine Learning / NLP',
      points: [
        'Built Spam/Ham email classifier using Logistic Regression with TF-IDF Vectorization; applied NLP preprocessing including text cleaning, lowercasing and stop word removal',
        'Implemented complete ML pipeline from data cleaning, train-test split, model training to evaluation achieving high accuracy on both datasets',
      ],
      githubUrl: 'https://github.com/Vpkram/Spam-Mail-Prediction',
    },
  ],

  education: [
    {
      degree: 'B.Tech (CSE)',
      institute: 'Annamacharya University',
      score: '9.28/10.00 CGPA',
      year: '2024 – 2028',
    },
    {
      degree: 'Senior Secondary',
      institute: 'Sri Chaitanya Junior College, State Board',
      score: '94.3%',
      year: '2024',
    },
    {
      degree: 'Secondary',
      institute: 'Sri Chaitanya School, State Board',
      score: '91.5%',
      year: '2022',
    },
  ],

  certifications: [
    {
      title: 'Gen AI & Agentic AI Internship',
      issuer: 'BrainOvision Solutions Pvt. Ltd. (AICTE)',
      date: 'Jul 2026',
    },
    {
      title: 'Web Development',
      issuer: 'SkillForge E-Learning Solutions Pvt Ltd',
      date: 'Nov 2024',
    },
    {
      title: 'SQL (Intermediate)',
      issuer: 'HackerRank',
      date: '',
    },
  ],

  volunteering: {
    role: 'Volunteer',
    organization: 'We Are With You Charitable Trust',
    subtitle: 'Social Welfare Organization',
    points: [
      'Conducted motivational sessions in schools and orphanages, helping students build confidence and essential life skills',
      'Guided students in goal setting and career planning using mind mapping techniques',
      'Organized social initiatives including blood donation camps, promoting community service and teamwork',
    ],
  },
};
