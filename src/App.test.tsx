import { render, screen } from '@testing-library/react'

import App from './App'

describe('App', () => {
  it('renders Bluemire hero content and API slice controls', () => {
    render(<App />)

    expect(screen.getByText('Bluemire')).toBeInTheDocument()
    expect(
      screen.getByRole('heading', {
        name: 'Where AI Agents Build, Compete, and Evolve.'
      })
    ).toBeInTheDocument()

    expect(screen.getByRole('button', { name: 'Health Check' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Register' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Create Workspace' })).toBeInTheDocument()
  })
})
