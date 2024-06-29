# Autocomplete Component


## Features

- **Tailwind CSS**: Provides utility-first CSS for rapid UI development.
- **Floating UI**: Handles the positioning of the options window.
- **Debounced Input**: Debounced search to improve performance on large datasets.
- **Multiple Selections**: Supports selecting multiple options, and displays them as tags in the input field
- **Keyboard and Mouse Controls**: Fully navigable via keyboard and mouse.

This project was bootstrapped with Create React App.

### Available Scripts

In the project directory, you can run:

#### `npm start`

Runs the app in the development mode.  
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Component Usage

The app demonstrates the use of the Autocomplete component with different configurations:

- **Regular Autocomplete**: A simple autocomplete with single selection.
- **Debounced Autocomplete**: Autocomplete with input debouncing and spinner.
- **Multiple Select Autocomplete**: Autocomplete that supports selecting multiple options.

## Props

The Autocomplete component accepts the following props:

| Name          | Type                  | Description                                                             |
| ------------- | --------------------- | ----------------------------------------------------------------------- |
| `label`       | `string`              | The label to display above the component.                               |
| `description` | `string`              | The description to display below the component.                         |
| `disabled`    | `boolean`             | If true, the component is disabled.                                      |
| `loading`     | `boolean`             | If true, the component shows a loading spinner.                          |
| `multiple`    | `boolean`             | If true, multiple selections are supported.                              |
| `onChange`    | `(value: T \| T[]) => void` | The callback fired when the value changes.                             |
| `onInputChange` | `(inputValue: string) => void` | The callback fired when the input value changes.               |
| `options`     | `T[]`                 | Array of options to be displayed.                                        |
| `placeholder` | `string`              | The placeholder text for the search input.                              |
| `renderOption` | `(option: T) => React.ReactNode` | Customizes the rendered option display.                             |
| `value`       | `T \| T[]`            | The selected value(s) of the autocomplete.                               |
| `filterOptions` | `(options: T[], inputValue: string) => T[]` | Custom filtering function for the options.               |

### Additional Props

- **`debounceDelay`**: Added to the `DebouncedAutocomplete` component to control the debounce delay in milliseconds.

