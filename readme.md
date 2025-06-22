# GraphQL Profile Dashboard

A dynamic web application that creates a personalized profile dashboard using GraphQL queries to fetch and display user data from the Reboot01 platform. The application features authentication, data visualization with SVG graphs, and a responsive user interface.

## 🚀 Live Demo

[View Live Application](https://sheeema04.github.io/graphql) 

## 📋 Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Usage](#usage)
- [GraphQL Queries](#graphql-queries)
- [Authentication](#authentication)
- [Data Visualization](#data-visualization)
- [API Endpoints](#api-endpoints)
- [Hosting](#hosting)
- [Contributing](#contributing)

## ✨ Features

### Authentication
- **Secure Login**: JWT-based authentication with Basic auth credentials
- **Dual Login Support**: Login with either username:password or email:password
- **Error Handling**: Comprehensive error messages for invalid credentials
- **Logout Functionality**: Secure session termination

### Profile Information
- **User Identity**: Display of basic user information (full name)
- **XP Tracking**: Real-time XP amount and transaction history
- **Level Progress**: Current level and progression tracking
- **Audit Ratio**: Performance metrics and audit statistics
- **Skills Overview**: Comprehensive skills assessment and display

### Data Visualization (SVG Graphs)
- **XP Progress Over Time**: Interactive timeline showing XP growth
- **Project Performance**: Visual representation of project completion rates
- **Audit Ratio Chart**: Graphical display of audit performance
- **Skills Radar Chart**: Multi-dimensional skills assessment visualization

### User Interface
- **Responsive Design**: Mobile-first approach with cross-device compatibility
- **Interactive Elements**: Hover effects and smooth transitions
- **Clean Layout**: Intuitive navigation and organized information display
- **Error Feedback**: User-friendly error messages and loading states

### Error Handling
- **Network error management**
- **Authentication failure handling**
- **Data validation and sanitization**
- **User-friendly error messaging**

## 🛠 Technologies Used

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **API**: GraphQL
- **Authentication**: JWT (JSON Web Tokens)
- **Data Visualization**: SVG with custom JavaScript
- **Hosting**: GitHub Pages 
- **Version Control**: Git

## 📁 Project Structure

```
graphql-profile/
├── index.html              # Login page
├── profile.html            # Main profile dashboard
├── Js/
│   ├── index.js            # Login functionality
│   ├── profile.js          # Main profile logic
│   ├── level.js            # Level rendering
│   ├── audits.js           # Audit ratio calculations
│   ├── skills.js           # Skills display
│   └── xp.js               # XP board rendering
├── Css/
│   └──  styles.css         # Main stylesheet
└── README.md               # Project documentation
```

## 🔧 Installation

1. **Clone the repository**
```bash
git clone https://github.com/sheeema04/graphql
```

2. **Navigate to project directory**
```bash
cd graphql
```

3. **Open in browser**
```bash
open index.html
```

## 📖 Usage

### Login Process
1. Navigate to the login page (`index.html`)
2. Enter your Reboot01 credentials (username/email and password)
3. Click "Login" to authenticate
4. You'll be redirected to your profile

### Profile Dashboard
- **View Profile**: See your basic information and statistics
- **Explore Graphs**: Interact with various data visualizations
- **Track Progress**: Monitor your XP growth and level progression
- **Logout**: Use the logout button to end your session securely

## 🔍 GraphQL Queries

### User Information Query
```graphql
{
  user {
    id
    login
    firstName
    lastName
  }
}
```

### XP Transactions Query
```graphql
{
  xpTransactions: transaction(
    where: { type: { _eq: "xp" } },
    order_by: { createdAt: desc }
  ) {
    amount
    createdAt
    path
    object {
      name
      type
    }
  }
}
```

### Level Progress Query
```graphql
{
  levelTransaction: transaction(
    where: { type: { _eq: "level" } }
    order_by: { createdAt: desc }
    limit: 1
  ) {
    amount
    createdAt
  }
}
```

### Audit Information Query
```graphql
{
  audits: transaction(
    where: { type: { _eq: "audit" } }
  ) {
    amount
    createdAt
    object {
      name
    }
  }
}
```

## 🔐 Authentication

### JWT Token Handling
- Tokens are stored securely in localStorage
- Bearer authentication for GraphQL requests
- Automatic token validation and cleanup
- Redirect to login on token expiration

### API Endpoints
- **Sign In**: `https://learn.reboot01.com/api/auth/signin`
- **GraphQL**: `https://learn.reboot01.com/api/graphql-engine/v1/graphql`

## 📊 Data Visualization

### SVG Graph Types
1. **XP Progress Timeline**: Line chart showing XP growth over time
2. **Project Completion Rate**: Bar chart of project success/failure ratios
3. **Audit Performance**: Pie chart displaying audit ratios
4. **Skills Assessment**: Radar chart for skill level visualization

### Interactive Features
- Hover tooltips with detailed information
- Clickable elements for data exploration
- Smooth animations and transitions
- Responsive scaling for different screen sizes

## 🌐 API Endpoints

| Endpoint | Method | Purpose | Authentication |
|----------|--------|---------|----------------|
| `/api/auth/signin` | POST | User authentication | Basic Auth |
| `/api/graphql-engine/v1/graphql` | POST | Data queries | Bearer Token |

## 🚀 Hosting

This project is hosted on GitHub Pages. To access:
**the live site** at `https://sheeema04.github.io/graphql`


## 🤝 Contributor :
- Shaima Hamad AlHamad (Salhamad)

## 🔧 Technical Implementation

### Query Types Used
- **Simple Queries**: Basic data retrieval
- **Nested Queries**: Related data fetching
- **Parameterized Queries**: Filtered and sorted results
- **Complex Queries**: Multiple table joins and aggregations

## 📄 License

This project is part of the **Reboot01** curriculum and is intended for educational purposes.
