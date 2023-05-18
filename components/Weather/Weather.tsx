import React, { useEffect, useState } from 'react'
import { Text } from 'react-native'

import { getCurrentWeather } from '../../data/api'
import { WeatherDto } from '../../types/dtos'
import { UiState } from '../../types/ui'

export default function Weather() {
  const [weather, setWeather] = useState<WeatherDto>()
  const [uiState, setUiState] = useState<UiState>('loading')

  useEffect(() => {
    async function fetchWeather() {
      const weather = await getCurrentWeather()

      if ('error' in weather) {
        setUiState('error')
        return
      }

      setWeather(weather)
      setUiState('idle')
    }

    fetchWeather()
  }, [])

  const renderWeatherText = () => {
    if (uiState === 'loading') {
      return 'Loading weather...'
    }

    if (uiState === 'error') {
      return 'Failed to fetch the weather. Try again later.'
    }

    if (!weather) {
      return 'Sorry, weather is not available'
    }

    return `It's ${weather.summary} today - temperature is ${weather.temperature}°C`
  }

  console.log('renderWeatherText', renderWeatherText())

  return (
    <Text
      style={{
        marginBottom: 20,
        marginTop: 0,
        textAlign: 'center',
      }}
    >
      {renderWeatherText()}
    </Text>
  )
}
