import { render, screen } from '@testing-library/react';
import App from './App';

test('renders traffic images', () => {
  render(<App />);
  const linkElement = screen.getByText(/Traffic Images/i);
  expect(linkElement).toBeInTheDocument();
});
