
# react-why-rendered

[![npm version](https://img.shields.io/npm/v/react-why-rendered?style=flat-square)](https://www.npmjs.com/package/react-why-rendered)  
[![License](https://img.shields.io/npm/l/react-why-rendered?style=flat-square)](LICENSE)

**react-why-rendered** is a lightweight React utility to **log exactly why a component re-rendered**. It works as a **custom hook** or a **HOC**, comparing previous and current props/state and printing clear logs to the console.

---

## Features

- Logs which props or state changed during a re-render  
- Works as a **hook** or **HOC**  
- Fully typed for TypeScript  
- Lightweight and zero dependencies  
- Works in React and React Native  
- Optional support for production-safe logging

---

## Installation

\`\`\`bash
npm install react-why-rendered
# or
yarn add react-why-rendered
\`\`\`

---

## Usage

### Hook Example

\`\`\`tsx
import React, { useState } from "react";
import { useWhyRendered } from "react-why-rendered";

const MyComponent = ({ value }: { value: number }) => {
  const [count, setCount] = useState(0);

  // Logs why this component re-rendered
  useWhyRendered("MyComponent", { value }, { count });

  return (
    <div>
      <p>{value}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
};
\`\`\`

### HOC Example

\`\`\`tsx
import { withWhyRendered } from "react-why-rendered";

const MyEnhancedComponent = withWhyRendered(MyComponent);
\`\`\`

---

## How It Works

- Shallow compares previous vs. current props/state  
- Prints a **grouped, formatted table** in console  
- Only logs when changes are detected  
- TypeScript generics ensure safety

---

## Tips

- Disable in production: wrap \`useWhyRendered\` calls with  
\`\`\`ts
if (process.env.NODE_ENV !== "production") { ... }
\`\`\`  
- For deep object comparisons, extend \`shallowDiff\` with \`lodash.isequal\`  
- Can integrate with logging tools like \`micro-log\` or Sentry

---

## Contributing

1. Fork the repo  
2. Run \`npm install\`  
3. Make your changes  
4. Run tests: \`npm test\`  
5. Create a pull request

---

## License

MIT © 2025
