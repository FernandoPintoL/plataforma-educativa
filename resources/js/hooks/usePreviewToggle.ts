import { useState } from 'react'

type LayoutMode = 'side' | 'tabs' | 'fullscreen'

interface UsePreviewToggleReturn {
  isPreviewVisible: boolean
  layoutMode: LayoutMode
  togglePreview: () => void
  setLayoutMode: (mode: LayoutMode) => void
  setPreviewVisible: (visible: boolean) => void
}

export function usePreviewToggle(defaultMode: LayoutMode = 'side'): UsePreviewToggleReturn {
  const [isPreviewVisible, setIsPreviewVisible] = useState(true)
  const [layoutMode, setLayoutMode] = useState<LayoutMode>(defaultMode)

  const togglePreview = () => {
    setIsPreviewVisible(prev => !prev)
  }

  return {
    isPreviewVisible,
    layoutMode,
    togglePreview,
    setLayoutMode,
    setPreviewVisible: setIsPreviewVisible
  }
}
