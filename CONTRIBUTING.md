# Contributing to UniLinks

First off, thank you for considering contributing to UniLinks! It's people like you that make UniLinks such a great tool for everyone.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Style Guidelines](#style-guidelines)
- [Commit Messages](#commit-messages)
- [Pull Request Process](#pull-request-process)

## Code of Conduct

This project and everyone participating in it is governed by our commitment to creating a welcoming and inclusive environment. Please be respectful and constructive in all interactions.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the issue list as you might find out that you don't need to create one. When you are creating a bug report, please include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps to reproduce the problem**
- **Provide specific examples to demonstrate the steps**
- **Describe the behavior you observed and what behavior you expected**
- **Include screenshots or animated GIFs if possible**
- **Include your environment details** (OS, browser, Node version, etc.)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:

- **Use a clear and descriptive title**
- **Provide a detailed description of the suggested enhancement**
- **Explain why this enhancement would be useful**
- **List any similar features in other applications if applicable**

### Pull Requests

We actively welcome your pull requests:

1. Fork the repo and create your branch from `main`
2. If you've added code that should be tested, add tests
3. Ensure the test suite passes
4. Make sure your code lints
5. Issue that pull request!

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/your-username/unilinks.git
   cd unilinks
   ```

3. **Add the upstream repository**:
   ```bash
   git remote add upstream https://github.com/original-owner/unilinks.git
   ```

4. **Install dependencies**:
   ```bash
   npm install
   ```

5. **Set up your environment**:
   - Configure Firebase as described in the README.md
   - Ensure all environment variables are set up

6. **Create a branch** for your changes:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development Workflow

1. **Make your changes** in your feature branch
2. **Run the development server**:
   ```bash
   npm run dev
   ```

3. **Test your changes** thoroughly in the browser
4. **Run linting**:
   ```bash
   npm run lint
   ```

5. **Build the project** to ensure no build errors:
   ```bash
   npm run build
   ```

6. **Commit your changes** with a descriptive commit message
7. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

## Style Guidelines

### TypeScript Style Guide

- Use **TypeScript** for all new files
- Define proper **types and interfaces** - avoid using `any`
- Use **functional components** with hooks
- Follow the existing code structure and naming conventions

### Code Formatting

- Use **2 spaces** for indentation
- Use **semicolons** at the end of statements
- Use **single quotes** for strings (unless interpolating)
- Add **trailing commas** in multiline objects and arrays

### Component Guidelines

- **One component per file** (except for small helper components)
- Use **PascalCase** for component names
- Use **camelCase** for functions and variables
- Place **interfaces** at the top of the file
- Order component code as follows:
  1. Imports
  2. Interfaces/Types
  3. Component definition
  4. Export statement

### Example Component Structure

```typescript
import { useState, useEffect } from 'react';
import type { ReactNode } from 'react';

interface MyComponentProps {
  title: string;
  children?: ReactNode;
}

export default function MyComponent({ title, children }: MyComponentProps) {
  const [state, setState] = useState<string>('');

  useEffect(() => {
    // Effect logic
  }, []);

  const handleClick = () => {
    // Handler logic
  };

  return (
    <div>
      <h1>{title}</h1>
      {children}
    </div>
  );
}
```

### CSS/Tailwind Guidelines

- Use **Tailwind CSS** utility classes
- Follow **mobile-first** responsive design
- Group related utilities together
- Use **custom classes sparingly** - prefer Tailwind utilities

## Commit Messages

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Type

- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation only changes
- **style**: Changes that don't affect code meaning (white-space, formatting)
- **refactor**: Code change that neither fixes a bug nor adds a feature
- **perf**: Performance improvement
- **test**: Adding or updating tests
- **chore**: Changes to build process or auxiliary tools

### Examples

```
feat(payment-links): add QR code generation feature

Add functionality to generate QR codes for payment links
to make sharing easier for mobile users.

Closes #123
```

```
fix(auth): resolve login redirect issue

Fixed bug where users were not redirected to dashboard
after successful login.

Fixes #456
```

## Pull Request Process

1. **Update the README.md** with details of changes if applicable
2. **Update documentation** for any new features or API changes
3. **Ensure all tests pass** and linting is clean
4. **Request review** from maintainers
5. **Address review comments** promptly
6. **Squash commits** if requested before merging

### Pull Request Template

When creating a pull request, please include:

- **Description**: What does this PR do?
- **Motivation**: Why is this change needed?
- **Testing**: How was this tested?
- **Screenshots**: If applicable, add screenshots
- **Related Issues**: Link any related issues

### Review Process

- At least one maintainer must approve the PR
- All CI checks must pass
- No merge conflicts
- Code follows style guidelines
- Adequate test coverage for new features

## Questions?

Don't hesitate to ask questions! You can:

- Open an issue with the `question` label
- Reach out to maintainers directly
- Join our community discussions

## Recognition

Contributors will be recognized in our README.md and release notes. We appreciate all contributions, big or small!

---

Thank you for contributing to UniLinks! 🎉
