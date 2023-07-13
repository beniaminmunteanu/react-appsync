# Data Synchronization:rocket:

This project is a prototype for levereging cloud services for a simple data synchronization use case. It involves building a system for real-time data synchronization among multiple clients. The implementation consists of a React frontend application and an AWS backend utilizing AWS AppSync GraphQL API, Cognito, and DynamoDB along with DynamoDB Streams. The frontend application allows users to create, read, update, and delete tasks, while the backend handles the storage and synchronization of tasks.

## Features :sparkles:

- :arrow_up_down: **Enables Uploading and Downloading Data Records**: Users can create, read, update, and delete tasks. The tasks are stored in DynamoDB and can be downloaded to the clients for viewing.

- :arrows_counterclockwise: **Synchronizes Data Across Multiple Clients**: Real-time data synchronization is achieved using AWS AppSync combined with DynamoDB Streams. Changes made to the tasks by one client are propagated to other clients in real-time through GraphQL subscriptions.

- :repeat: **Supports Incremental Synchronization**: DynamoDB Streams captures changes made to the tasks, and AWS AppSync's GraphQL subscriptions deliver those changes to the clients. Clients can retrieve only the data records that were updated since the previous synchronization operation, achieving incremental synchronization.

- :cloud: **Cloud Deployment with CI/CD**: The solution is deployed in the cloud using a CI/CD pipeline implemented with AWS Amplify Hosted Environments. This ensures that the latest version of the application is always available to users.

## Technologies Used :computer:

- React: A JavaScript library for building user interfaces, used for the client application.
- Tailwind CSS: A utility-first CSS framework, utilized for styling the React components.
- AWS Amplify: A development platform for building scalable and secure applications on AWS.
- AWS AppSync: A managed service for creating and deploying GraphQL APIs.
- AWS Cognito: A user management and authentication service provided by AWS.
- AWS DynamoDB: A NoSQL database service for storing the tasks data.
- AWS DynamoDB Streams: A feature of DynamoDB that captures real-time data changes.
- AWS Amplify Hosting Environment: A managed environment where the application files are stored and served to users over the internet.

## Authentication System :closed_lock_with_key:

The React application implements a fully-fledged authentication system using AWS Amplify. AWS Cognito User Pool is used to manage user accounts and handle user authentication. Users can create accounts, and email verification is enforced for added security. The authentication flow includes registration, login, and token-based authentication for subsequent API calls.

## AWS Amplify Setup :gear:

The AWS Amplify CLI is utilized for easy AWS service provisioning and configuration. The Amplify project is initialized and configured with the required services, including the GraphQL API and authentication. Configuration files are generated, allowing the React application to seamlessly connect with AWS services.

## GraphQL API Configuration :pager:

A GraphQL schema is defined for the tasks data, specifying fields such as task ID, title, and description. The schema is used to generate queries, mutations, and subscriptions for performing CRUD operations on the tasks data. Authorization rules are applied to the API, ensuring that only authenticated users can access and modify the tasks data. JWT tokens are used for authentication, and the API checks for valid tokens in the request headers.

## Data Synchronization Process :arrows_clockwise:

Whenever a user performs a task-related action in the React application (e.g., creating, updating, or deleting a task), the GraphQL API is invoked. The API processes the request, authenticates the user, and persists the changes in the DynamoDB database.

DynamoDB Streams, enabled on the database, capture the real-time changes made to the tasks data. AWS AppSync, through GraphQL subscriptions, listens to the DynamoDB Streams and receives notifications for data changes. GraphQL subscriptions utilize WebSockets under the hood to establish a real-time connection between the API and the React clients.

Whenever a change occurs in the tasks data, the API pushes the updates to the subscribed clients, ensuring real-time synchronization. The React clients receive the updates and reflect them on the user interface, providing a collaborative and synchronized experience.

## Deployment :rocket:

The application is deployed using a CI/CD pipeline implemented with AWS Amplify Hosted Environments. The pipeline is triggered whenever new code is pushed to the main branch of the GitHub repository. This ensures that the latest version of the application is automatically built and deployed, providing seamless updates to the deployed application.

---
