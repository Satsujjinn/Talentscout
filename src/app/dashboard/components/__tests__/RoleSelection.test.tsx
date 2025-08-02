import { render, screen } from '@testing-library/react'
import RoleSelection from '../RoleSelection'

// Mock fetch globally
global.fetch = jest.fn()

describe('RoleSelection', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders role selection options', () => {
    render(<RoleSelection />)
    
    expect(screen.getByText("I'm an Athlete")).toBeInTheDocument()
    expect(screen.getByText("I'm a Recruiter")).toBeInTheDocument()
    expect(screen.getByText('Choose Your Role')).toBeInTheDocument()
  })

  it('renders with correct styling classes', () => {
    render(<RoleSelection />)
    
    const athleteButton = screen.getByText("I'm an Athlete")
    const recruiterButton = screen.getByText("I'm a Recruiter")
    
    expect(athleteButton).toHaveClass('border-warm-brown-300')
    expect(recruiterButton).toHaveClass('border-warm-brown-300')
  })

  it('has proper button structure', () => {
    render(<RoleSelection />)
    
    const buttons = screen.getAllByRole('button')
    expect(buttons).toHaveLength(2)
    
    buttons.forEach(button => {
      expect(button).toHaveClass('w-full')
      expect(button).toHaveClass('h-16')
    })
  })
}) 