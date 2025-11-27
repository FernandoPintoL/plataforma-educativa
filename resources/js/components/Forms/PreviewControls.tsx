import { Button } from '@/components/ui/button'
import { Eye, EyeOff, Columns2, Columns3, Maximize2 } from 'lucide-react'
import { cn } from '@/lib/utils'

type LayoutMode = 'side' | 'tabs' | 'fullscreen'

interface PreviewControlsProps {
  isVisible: boolean
  onToggle: () => void
  layoutMode?: LayoutMode
  onLayoutChange?: (mode: LayoutMode) => void
  className?: string
}

export default function PreviewControls({
  isVisible,
  onToggle,
  layoutMode = 'side',
  onLayoutChange,
  className = ''
}: PreviewControlsProps) {
  return (
    <div className={cn('flex gap-2 mb-4 items-center', className)}>
      {/* Toggle Visibility */}
      <Button
        variant={isVisible ? 'default' : 'outline'}
        size="sm"
        onClick={onToggle}
        title={isVisible ? 'Ocultar vista previa' : 'Mostrar vista previa'}
        className="gap-2"
      >
        {isVisible ? (
          <>
            <Eye className="w-4 h-4" />
            <span className="hidden sm:inline">Ocultar</span>
          </>
        ) : (
          <>
            <EyeOff className="w-4 h-4" />
            <span className="hidden sm:inline">Mostrar</span>
          </>
        )}
      </Button>

      {/* Layout Options */}
      {onLayoutChange && (
        <div className="flex gap-1 ml-2">
          <Button
            variant={layoutMode === 'side' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onLayoutChange('side')}
            title="Vista lado a lado"
            className="gap-1"
          >
            <Columns2 className="w-4 h-4" />
            <span className="hidden sm:inline">Lado</span>
          </Button>
          <Button
            variant={layoutMode === 'tabs' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onLayoutChange('tabs')}
            title="Vista en pestañas"
            className="gap-1"
          >
            <Columns3 className="w-4 h-4" />
            <span className="hidden sm:inline">Tabs</span>
          </Button>
          <Button
            variant={layoutMode === 'fullscreen' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onLayoutChange('fullscreen')}
            title="Vista completa"
            className="gap-1"
          >
            <Maximize2 className="w-4 h-4" />
            <span className="hidden sm:inline">Full</span>
          </Button>
        </div>
      )}
    </div>
  )
}
