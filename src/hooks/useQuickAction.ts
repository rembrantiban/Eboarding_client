import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"

export type QuickAction = "create-announcement" | "assign-penalty" | "create-rule"

/**
 * Returns true when the page was opened from a dashboard quick action
 * (`navigate(path, { state: { quickAction } })`). The state is cleared right
 * away so a refresh or back-navigation doesn't reopen the modal.
 */
export const useQuickAction = (action: QuickAction) => {
  const location = useLocation()
  const navigate = useNavigate()
  const [requested] = useState(
    () => (location.state as { quickAction?: string } | null)?.quickAction === action
  )

  useEffect(() => {
    if (requested) {
      navigate(`${location.pathname}${location.search}`, { replace: true, state: null })
    }
    // Only clear once, on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return requested
}
