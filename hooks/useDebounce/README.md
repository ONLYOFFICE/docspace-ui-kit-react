# useDebounce Hook

React hook for debouncing callback functions with automatic cleanup.

## Overview

`useDebounce` creates a debounced version of a callback function that delays execution until after a specified delay period has elapsed since the last invocation. Useful for optimizing performance in scenarios like search inputs, form validation, or API calls.

## Usage

```tsx
import { useState } from 'react';
import { useDebounce } from '@docspace/ui-kit/hooks/useDebounce';

function SearchComponent() {
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = (query: string) => {
    // This will only execute after user stops typing for 500ms
    fetch(`/api/search?q=${query}`)
      .then(res => res.json())
      .then(setSearchResults);
  };

  const debouncedSearch = useDebounce(handleSearch, 500);

  return (
    <input
      type="text"
      onChange={(e) => debouncedSearch(e.target.value)}
      placeholder="Search..."
    />
  );
}
```

## API

### Parameters

- **`callback`** (`(value: string) => void`): The function to debounce. Receives a string value as parameter.
- **`delay`** (`number`): The delay in milliseconds to wait before executing the callback.

### Return Value

Returns a debounced version of the callback function with the same signature: `(value: string) => void`

## How It Works

1. When the debounced function is called, any pending timer is cleared
2. A new timer is set for the specified delay
3. If the function is called again before the delay expires, the timer resets
4. After the delay expires without new calls, the original callback executes
5. All timers are automatically cleaned up on component unmount

## Example: Form Validation

```tsx
function EmailInput() {
  const [email, setEmail] = useState('');
  const [isValid, setIsValid] = useState<boolean | null>(null);

  const validateEmail = (value: string) => {
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    setIsValid(isValidEmail);
  };

  const debouncedValidate = useDebounce(validateEmail, 300);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    debouncedValidate(value);
  };

  return (
    <div>
      <input
        type="email"
        value={email}
        onChange={handleChange}
        placeholder="Enter email"
      />
      {isValid === false && <span>Invalid email</span>}
      {isValid === true && <span>Valid email</span>}
    </div>
  );
}
```

## Example: Auto-save

```tsx
function AutoSaveEditor() {
  const [content, setContent] = useState('');

  const saveContent = (text: string) => {
    localStorage.setItem('draft', text);
    console.log('Content saved!');
  };

  const debouncedSave = useDebounce(saveContent, 1000);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setContent(value);
    debouncedSave(value);
  };

  return (
    <textarea
      value={content}
      onChange={handleChange}
      placeholder="Start typing... (auto-saves after 1s)"
    />
  );
}
```

## Notes

- The debounced callback is memoized and only recreates when `callback` or `delay` changes
- Timers are automatically cleared on component unmount to prevent memory leaks
- Each call to the debounced function resets the timer
- The callback signature is currently limited to `(value: string) => void`
