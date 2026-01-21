# AI-Farm

## Description

AI-Farm is an application built to help farmers efficiently manage their farm fields through a structured and reliable logging system.  

The first phase of AI-Farm focuses on providing a robust logging system where users can record field-related information such as activities, observations, and inputs. This establishes a solid data foundation for future enhancements.

In later stages, the application is planned to evolve into an AI-assisted platform that can analyze logged data and provide intelligent recommendations. These recommendations may include guidance on chemical usage, fertilizer selection, and dosage suggestions tailored to specific fields and conditions.

## Inspiration

The inspiration for AI-Farm comes from a real-world need: helping a farmer manage multiple fields more effectively while maintaining accurate records. The goal is to combine practical farm management with modern technology, enabling better decision-making and long-term productivity through data-driven insights.



## Tech Stack

### Backend
- **Go (Golang)** – Core backend services, business logic, and APIs
- **Go Testing** – Unit and integration testing to ensure backend reliability

### Frontend
- **Next.js** – Frontend framework supporting server-side rendering and modern web applications
- **TypeScript** – Type-safe frontend development
- **shadcn/ui** – Reusable and accessible UI components
- **Tailwind CSS** – Utility-first CSS framework for consistent and maintainable styling

### Database & Storage
- **PostgreSQL** – Primary relational database for structured farm and field data
- **Goose** – Database migration tool for versioned schema management

### Infrastructure & DevOps
- **Nginx** – Reverse proxy, SSL termination, and load balancing
- **Docker** – Containerization for consistent development and deployment
- **Docker Compose** – Local development and service orchestration

### Security & Authentication
- **JWT / OAuth2** – Secure authentication and authorization mechanisms
- **Secrets Management** – Secure handling of credentials and sensitive configuration
