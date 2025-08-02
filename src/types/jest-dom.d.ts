import '@testing-library/jest-dom'

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R
      toHaveClass(className: string): R
      toBeDisabled(): R
      toHaveTextContent(text: string): R
      toHaveAttribute(attr: string, value?: string): R
      toBeVisible(): R
      toBeEmpty(): R
      toHaveFocus(): R
      toHaveValue(value: string | number | string[]): R
      toBeChecked(): R
      toBePartiallyChecked(): R
      toHaveDescription(text?: string | RegExp): R
    }
  }
} 