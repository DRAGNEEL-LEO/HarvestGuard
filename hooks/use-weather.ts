import { useEffect, useRef, useState } from 'react'

type Weather = {
  location: string
  temperature?: number
  humidity?: number
  rainChance?: number
  windSpeed?: number
  condition?: string
  forecast?: any[]
  error?: string
}

const CACHE_TTL = 1000 * 60 * 5 // 5 minutes

const cache = new Map<string, { ts: number; data: Weather }>()

async function fetchWeather(location: string): Promise<Weather> {
  try {
    const res = await fetch(`/api/weather?location=${encodeURIComponent(location)}`)
    if (!res.ok) {
      return { location, error: 'Failed to fetch' }
    }
    const data = await res.json()
    return { location, ...data }
  } catch (err: any) {
    return { location, error: err?.message || 'Error' }
  }
}

export function useWeather(locations: string[]) {
  const [state, setState] = useState<Record<string, Weather | null>>({})
  const mounted = useRef(true)

  useEffect(() => {
    mounted.current = true
    return () => {
      mounted.current = false
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    async function loadAll() {
      const results: Record<string, Weather | null> = {}
      const toFetch: string[] = []
      const now = Date.now()
      for (const loc of locations) {
        const key = loc || 'Dhaka'
        const cached = cache.get(key)
        if (cached && now - cached.ts < CACHE_TTL) {
          results[key] = cached.data
        } else {
          results[key] = null
          toFetch.push(key)
        }
      }

      if (!cancelled && mounted.current) setState((s) => ({ ...s, ...results }))

      await Promise.all(
        toFetch.map(async (loc) => {
          const data = await fetchWeather(loc)
          cache.set(loc, { ts: Date.now(), data })
          if (!cancelled && mounted.current) setState((s) => ({ ...s, [loc]: data }))
        })
      )
    }

    if (locations && locations.length > 0) loadAll()

    return () => {
      cancelled = true
    }
  }, [locations.join('|')])

  return state
}

export function clearWeatherCache() {
  cache.clear()
}
