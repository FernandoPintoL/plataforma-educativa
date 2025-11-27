import React from 'react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline'

interface QuestionQualityBadgeProps {
  score: number // 0-100
  clarityScore?: number // 0-1
  bloomLevel?: string
  difficulty?: number // 0-1
  showIcon?: boolean
  compact?: boolean
  className?: string
}

export default function QuestionQualityBadge({
  score,
  clarityScore,
  bloomLevel,
  difficulty,
  showIcon = true,
  compact = false,
  className = '',
}: QuestionQualityBadgeProps) {
  const getScoreColor = (): string => {
    if (score >= 80) return 'bg-green-100 text-green-800 border-green-200'
    if (score >= 60) return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    return 'bg-red-100 text-red-800 border-red-200'
  }

  const getIcon = () => {
    if (score >= 80) return <CheckCircleIcon className="h-3 w-3" />
    if (score >= 60) return <ExclamationTriangleIcon className="h-3 w-3" />
    return <ExclamationCircleIcon className="h-3 w-3" />
  }

  const getScoreLabel = (): string => {
    if (score >= 80) return 'Excelente'
    if (score >= 60) return 'Buena'
    return 'Necesita mejoras'
  }

  if (compact) {
    return (
      <div className={cn('flex items-center gap-1', className)}>
        <Badge variant="outline" className={cn('text-xs', getScoreColor())}>
          {showIcon && getIcon()}
          <span className="ml-1">{score}</span>
        </Badge>
      </div>
    )
  }

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <div className={cn('flex items-center gap-2 px-2 py-1 rounded border', getScoreColor())}>
        {showIcon && getIcon()}
        <div className="flex-1">
          <span className="text-sm font-semibold">{getScoreLabel()}</span>
          <span className="text-xs ml-2 opacity-75">{score}/100</span>
        </div>
      </div>

      {(clarityScore !== undefined || bloomLevel || difficulty !== undefined) && (
        <div className="flex gap-1 text-xs flex-wrap">
          {clarityScore !== undefined && (
            <Badge variant="secondary" className="text-xs">
              Claridad: {Math.round(clarityScore * 100)}%
            </Badge>
          )}
          {bloomLevel && (
            <Badge variant="secondary" className="text-xs">
              {bloomLevel}
            </Badge>
          )}
          {difficulty !== undefined && (
            <Badge variant="secondary" className="text-xs">
              Dif: {difficulty < 0.4 ? 'Fácil' : difficulty < 0.7 ? 'Media' : 'Difícil'}
            </Badge>
          )}
        </div>
      )}
    </div>
  )
}
