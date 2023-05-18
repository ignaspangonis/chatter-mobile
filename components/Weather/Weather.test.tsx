import { render, screen, waitFor } from '@testing-library/react'

import * as api from 'src/data/api'

import Weather from './Weather'

describe('<Weather />', () => {
  const getCurrentWeather = jest.spyOn(api, 'getCurrentWeather')

  beforeEach(() => {
    getCurrentWeather.mockReturnValue(new Promise(() => {}))
  })

  it('renders loading state', () => {
    render(<Weather />)

    expect(screen.getByText('Loading weather...')).toBeInTheDocument()
  })

  it('calls api to get weather', async () => {
    render(<Weather />)

    await waitFor(() => expect(getCurrentWeather).toHaveBeenCalledTimes(1))
  })

  describe('when api call is successful', () => {
    beforeEach(() => {
      getCurrentWeather.mockResolvedValue({
        temperature: 30,
        time: '12:00',
        summary: 'hot',
      })
    })

    it('renders correctly', async () => {
      render(<Weather />)

      expect(await screen.findByText("It's hot today - temperature is 30°C")).toBeInTheDocument()
    })
  })

  describe('when api call fails', () => {
    beforeEach(() => {
      getCurrentWeather.mockResolvedValue({
        status: 400,
        error: 'Something went wrong',
      })
    })

    it('renders error state', async () => {
      render(<Weather />)

      expect(
        await screen.findByText('Failed to fetch the weather. Try again later.'),
      ).toBeInTheDocument()
    })
  })
})
