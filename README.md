# Food Delivery App

**Food Delivery App** is a full-stack food delivery platform designed to bring the experience of fine dining directly to your doorstep. The application integrates restaurant services, customer interactions, and delivery logistics into one streamlined ecosystem, enriched with intelligent analytics and ML-powered features.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Core Features](#core-features)
- [Machine Learning Components](#machine-learning-components)
- [Technology Stack](#technology-stack)
- [System Architecture](#system-architecture)
- [Database Design](#database-design)
- [Modules](#modules)
- [Testing Strategy](#testing-strategy)
- [Challenges & Solutions](#challenges--solutions)
- [How to Run](#how-to-run)


---

## Project Overview

Food Delivery App is designed to provide a seamless food ordering and delivery experience by connecting customers, restaurants, and delivery agents. The platform supports real-time order tracking, role-based dashboards, automated notifications, and powerful business insights. It leverages machine learning techniques to enhance functionality and decision making.

---

## Core Features

- **User Authentication & Role Management:** Secure login with session timeout and permission-based access for customers, restaurant admins, and delivery agents.
- **Menu Management:** Dynamic menu updates, integration with inventory, and export/printing capabilities.
- **Order Management:** Live order tracking, efficient order assignment, and reassignment.
- **Delivery Agent Dashboard:** Centralized view with order management and performance tracking.
- **Business Insights:** Analytics dashboards showcasing top-selling items, order frequency analysis, and customer insights.
- **Notifications & Alerts:** Automated SMS/Email updates and reporting for stakeholders.

---

## Machine Learning Components

Food Delivery App includes several ML-based features to optimize service and operations:

- **Anomaly Detection:** Uses the K-Means algorithm for detecting unusual patterns in order data.
- **Sentiment Analysis:** Applies predefined linguistic and contextual rules to assess customer feedback.
- **Route Optimization:** Implements graph algorithms to calculate the optimal delivery paths.
- **Revenue Trend Analysis:** Utilizes data visualization tools to present financial insights.
- **Performance Metrics:** Offers real-time insights into agent and operational performance.

---

## Technology Stack

| Layer        | Technologies                                  |
|--------------|-----------------------------------------------|
| Frontend     | HTML, CSS, JavaScript                         |
| Backend      | Python Flask                                  |
| Database     | MySQLite3                                     |
| Visualization| Seaborn, Matplotlib, Chart.js, Plotly         |
| Testing      | PyTest, Postman                               |

---

## System Architecture

The system supports multi-role access with specific dashboards for each user type:

- **Customer:** Browse menus, place orders, track deliveries.
- **Restaurant Admin:** Manage orders, update menus, view business metrics.
- **Delivery Agent:** Access assigned orders, monitor performance metrics, communicate with customers and support.

User authentication and session management are handled securely to prevent unauthorized access.

---

## Database Design

The database schema includes the following entities:

- **Users & Roles:** Managing different access levels.
- **Orders & Statuses:** Tracking order progression from placement to delivery.
- **Menu Items:** Storing dynamic data related to food items and availability.
- **Delivery Routes:** Capturing optimal paths and assignments.
- **Performance Logs:** Recording metrics for analytics and reporting.
- **Feedback & Reviews:** Maintaining customer feedback for sentiment analysis.

---

## Modules

- **User Authentication & Role Management:** Secure login and tailored access.
- **Menu Management:** Dynamic updates and export/print functionality.
- **Order Management:** Full lifecycle control including assignment and tracking.
- **Delivery Dashboard:** Specialized interface for delivery agents.
- **Analytics & Reporting:** Business insights through data visualization.
- **Notification System:** Automated alerts and communication tools.

---

## Testing Strategy

Testing was an integral part of the development process:

- **Manual Testing**
- **Unit Testing**
- **Integration Testing**
- **System Testing**

**Statistics:**
- User Stories: 77
- Test Cases: 88

Key test areas include order tracking, authentication, cart & checkout validation, and role-based management.

---

## Challenges & Solutions

- **Visualization Errors:** Resolved issues caused by data inconsistencies with standardized formatting.
- **Real-Time Tracking:** Optimized API calls to reduce latency and ensure accuracy.
- **Integration Difficulties:** Streamlined communication between system components and third-party APIs.
- **Agile Development:** Iterative sprints enabled continuous feedback and improvement.

---

## How to Run

### Prerequisites

- Python 3.x
- Flask
- SQLite3
- Node.js (optional, for frontend enhancements)
- Postman (for API testing)

### Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/Mahima-Pattanayak/Food_Delivery_App.git
cd Food_Delivery_App
pip install -r requirements.txt
python app.py
