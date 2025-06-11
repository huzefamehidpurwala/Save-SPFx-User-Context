SharePoint Context Logger API

A backend application for storing user details.

Technologies used...

NodeJS, Express, TypeScript, Azure

Make sure all terminal commands work in Powershell.

Use the latest ES6+ features and TypeScript with strict mode enabled and with best javascript practices.

Packages such `express`, `dotenv`, `axios` and `jsonwebtoken` are already installed.
Dev packages such `@types/express`, `@types/jsonwebtoken`, `@types/node`, `eslint`, `nodemon`, `prettier`, `ts-node` and `typescript` are already installed.
TypeScript is configured with `tsconfig.json` file.

# 🏗 React / Tailwind CSS / Express / MS Graph API Best Practices

This guide outlines **best practices** for building a modern web application using **React**, **Tailwind CSS**, **Express**, and **Microsoft Graph API**. The focus is on **readability**, **maintainability**, and **scalability**, ensuring a clean and efficient codebase.

---

## 📁 Frontend Structure

Maintain a **flat and predictable** folder structure:

```
/src
  /components  # Reusable UI components (buttons, inputs, cards, etc.)
  /pages       # Page components (mapped to routes)
  /hooks       # Custom React hooks
  /utils       # Utility functions (date formatting, API requests, etc.)
  /assets      # Static assets (images, icons, etc.)
  /styles      # Tailwind config and global CSS files
  /routes      # Express route handlers
  /services    # External service integrations (e.g., MS Graph API)
  /config      # Configuration files (e.g., environment variables)
  main.tsx     # Entry point
  App.tsx      # Root component
  routes.tsx   # Centralized route definitions
```

📌 **Guidelines:**

- **Flat over nested**: Simplify navigation and reduce complexity.
- **Component proximity**: Keep components close to their usage context.
- **Clear separation**: Distinguish between UI, logic, and configuration.

---

## 📁 Backend Structure

Maintain a **flat and predictable** folder structure:

```
/src
  /config        # Service configs
  /controllers   # HTTP request handlers
  /routes        # Express route definitions
  /models        # Data schemas/models (e.g., for Graph API or local DB)
  /services      # Business logic & external interactions (MS Graph API)
  /middlewares   # Custom middleware (auth, logging, error handling)
  /utils         # Helper functions
  app.ts         # Express app setup
  server.ts      # Server bootstrap
```

📌 **Guidelines:**

- **Flat over nested**: Simplify navigation and reduce complexity.
- **Clear separation**: Distinguish between models, services, logic, and configuration.

---

## ⚛ React Best Practices (2025)

### ✅ Functional Components with Hooks

- Prefer **functional components** over class components for simplicity and readability.
- Utilize **React Hooks** (`useState`, `useEffect`, `useCallback`, `useMemo`) for state and lifecycle management.

### ✅ Component Design

- **Single Responsibility**: Each component should have one clear purpose.
- **Reusability**: Design components to be reusable across different parts of the application.
- **Composition**: Build complex UIs by composing simpler components.

### ✅ Performance Optimization

- Use `React.memo` to prevent unnecessary re-renders.
- Apply `useCallback` and `useMemo` to memoize functions and values.
- Implement **code splitting** with `React.lazy` and `Suspense` for dynamic imports.

### ✅ State Management

- Leverage **React Context** for global state that doesn't require a dedicated state management library.
- For complex state, consider lightweight solutions like **Zustand** or **Recoil**.

### ✅ Type Safety

- Use **TypeScript** to define clear interfaces and types, enhancing code reliability and maintainability.

---

## 🎨 Tailwind CSS Best Practices (2025)

### ✅ Utility-First Approach

- Embrace Tailwind's utility classes for rapid UI development.
- Avoid writing custom CSS unless necessary.

### ✅ Class Organization

- Maintain a consistent order: layout, position, spacing, typography, color, etc.
- Use tools like `prettier-plugin-tailwindcss` to auto-sort classes.

### ✅ Reusable Styles

- Utilize `@apply` in CSS files to create reusable style patterns.
- Define custom components (e.g., `<Button>`, `<Card>`) to encapsulate common styles.

### ✅ Responsive Design

- Implement responsive utilities (`sm:`, `md:`, `lg:`, etc.) for mobile-first design.
- Use `container` and `max-w-*` classes to control layout width.

### ✅ Dark Mode and Theming

- Configure `darkMode` in `tailwind.config.js` (`'media'` or `'class'`).
- Define custom themes using the `extend` property in the Tailwind configuration.

### ✅ Performance Optimization

- Enable **Just-In-Time (JIT)** mode for faster builds and smaller CSS files.
- Purge unused styles by specifying content paths in `tailwind.config.js`.

---

## 🛠 Backend Integration: Express & MS Graph API

### ✅ Express Server Setup

- Organize routes in the `/api` directory, separating concerns by resource.
- Use middleware for common functionalities (e.g., authentication, logging).

### ✅ Microsoft Graph API Integration

- Authenticate using OAuth 2.0 and acquire access tokens securely.
- Interact with Microsoft services (e.g., Outlook, OneDrive) through the Graph API.
- Handle errors gracefully and implement retry logic for robustness.

### ✅ Security Best Practices

- Store sensitive information (e.g., API keys, secrets) in environment variables.
- Validate and sanitize all incoming data to prevent injection attacks.
- Implement rate limiting and other security measures to protect APIs.

---

## 🧪 Testing and Quality Assurance

### ✅ Testing Strategy

- Write unit tests for components and utility functions using frameworks like **Jest**.
- Perform integration tests for API endpoints with tools like **Supertest**.
- Utilize **React Testing Library** for testing UI components in a user-centric manner.

### ✅ Linting and Formatting

- Use **ESLint** to enforce code quality and catch potential issues.
- Apply **Prettier** for consistent code formatting across the codebase.

---

## 🚀 Deployment and DevOps

### ✅ Environment Management

- Use `.env` files for environment-specific configurations.
- Ensure environment variables are loaded securely in both frontend and backend.

### ✅ Continuous Integration/Continuous Deployment (CI/CD)

- Set up CI/CD pipelines to automate testing, building, and deployment processes.
- Monitor application performance and errors using tools like **Sentry** or **New Relic**.

---

## 🔥 Final Thoughts

1. **Keep it simple**: Avoid unnecessary complexity.
2. **Prioritize readability**: Write code that's easy to understand and maintain.
3. **Embrace modularity**: Build components and services that are reusable and composable.
4. **Stay updated**: Keep up with the latest best practices and updates in the technologies used.
5. **Focus on user experience**: Ensure the application is responsive, accessible, and performant.
