import { useState, useEffect } from 'react'
import { getUserDashboardStats } from '@/lib/firebase/firestore'
import { useAuth } from '@/lib/firebase/AuthContext'

/**
 * Custom hook to fetch and manage dashboard statistics for the authenticated user.
 * 
 * @returns {{ stats: Object|null, isLoading: boolean, error: Error|null }}
 */
export function useDashboardStats() {
  const { user } = useAuth()
  const [stats, setStats] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let isMounted = true

    const fetchStats = async () => {
      if (!user) {
        if (isMounted) {
          setStats(null)
          setIsLoading(false)
        }
        return
      }

      try {
        setIsLoading(true)
        setError(null)
        const userStats = await getUserDashboardStats(user.uid)
        if (isMounted) {
          setStats(userStats)
        }
      } catch (err) {
        console.error("Error fetching dashboard stats:", err)
        if (isMounted) setError(err)
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }

    fetchStats()

    return () => {
      isMounted = false
    }
  }, [user])

  return { stats, isLoading, error }
}
