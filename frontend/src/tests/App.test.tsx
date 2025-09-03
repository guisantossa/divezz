import { render, screen } from '@testing-library/react';
import App from '../App';

describe('App Component', () => {
  test('renders the app title', () => {
    render(<App />);
    const titleElement = screen.getByText(/Splitwise Clone/i);
    expect(titleElement).toBeInTheDocument();
  });

  test('renders the navigation links', () => {
    render(<App />);
    const dashboardLink = screen.getByText(/Dashboard/i);
    const groupsLink = screen.getByText(/Groups/i);
    const authLink = screen.getByText(/Auth/i);
    expect(dashboardLink).toBeInTheDocument();
    expect(groupsLink).toBeInTheDocument();
    expect(authLink).toBeInTheDocument();
  });
});