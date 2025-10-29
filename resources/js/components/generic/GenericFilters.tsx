// Presentation Layer: Generic filters component
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Filter, X } from 'lucide-react'
import type { FilterField } from '@/domain/generic'
import type { Filters } from '@/domain/shared'

interface GenericFiltersProps {
    filters: FilterField[]
    values: Filters
    onChange: (key: string, value: unknown) => void
    onApply: () => void
    onClear: () => void
    activeCount?: number
    disabled?: boolean
    className?: string
}

export default function GenericFilters({
    filters,
    values,
    onChange,
    onApply,
    onClear,
    activeCount = 0,
    disabled = false,
    className = ''
}: GenericFiltersProps) {
    if (!filters || filters.length === 0) {
        return null
    }

    const renderFilterField = (filter: FilterField) => {
        const value = values[filter.key]

        switch (filter.type) {
            case 'select':
                return (
                    <div key={filter.key} className="space-y-2">
                        <Label htmlFor={filter.key} className="text-sm font-medium">
                            {filter.label}
                        </Label>
                        <select
                            id={filter.key}
                            value={value ? String(value) : ''}
                            onChange={(e) => onChange(filter.key, e.target.value || null)}
                            disabled={disabled}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <option value="">Todos</option>
                            {filter.options?.map((option) => (
                                <option key={String(option.value)} value={String(option.value)}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>
                )

            case 'boolean':
                return (
                    <div key={filter.key} className="space-y-2">
                        <Label htmlFor={filter.key} className="text-sm font-medium">
                            {filter.label}
                        </Label>
                        <select
                            id={filter.key}
                            value={value !== undefined && value !== null ? String(value) : ''}
                            onChange={(e) => onChange(filter.key, e.target.value === '' ? null : e.target.value === '1')}
                            disabled={disabled}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <option value="">Todos</option>
                            <option value="1">Sí</option>
                            <option value="0">No</option>
                        </select>
                    </div>
                )

            case 'number':
                return (
                    <div key={filter.key} className="space-y-2">
                        <Label htmlFor={filter.key} className="text-sm font-medium">
                            {filter.label}
                        </Label>
                        <Input
                            id={filter.key}
                            type="number"
                            value={value ? String(value) : ''}
                            onChange={(e) => onChange(filter.key, e.target.value ? parseFloat(e.target.value) : null)}
                            placeholder={filter.placeholder}
                            disabled={disabled}
                        />
                    </div>
                )

            case 'date':
                return (
                    <div key={filter.key} className="space-y-2">
                        <Label htmlFor={filter.key} className="text-sm font-medium">
                            {filter.label}
                        </Label>
                        <Input
                            id={filter.key}
                            type="date"
                            value={value ? String(value) : ''}
                            onChange={(e) => onChange(filter.key, e.target.value || null)}
                            disabled={disabled}
                        />
                    </div>
                )

            case 'text':
            default:
                return (
                    <div key={filter.key} className="space-y-2">
                        <Label htmlFor={filter.key} className="text-sm font-medium">
                            {filter.label}
                        </Label>
                        <Input
                            id={filter.key}
                            type="text"
                            value={value ? String(value) : ''}
                            onChange={(e) => onChange(filter.key, e.target.value || null)}
                            placeholder={filter.placeholder}
                            disabled={disabled}
                        />
                    </div>
                )
        }
    }

    return (
        <div className={`rounded-lg border border-border bg-card p-4 ${className}`}>
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <h3 className="text-sm font-semibold text-foreground">Filtros</h3>
                    {activeCount > 0 && (
                        <Badge variant="secondary" className="text-xs">
                            {activeCount} activo{activeCount > 1 ? 's' : ''}
                        </Badge>
                    )}
                </div>
                {activeCount > 0 && (
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={onClear}
                        disabled={disabled}
                        className="h-8 text-xs"
                    >
                        <X className="h-3 w-3 mr-1" />
                        Limpiar
                    </Button>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filters.map(filter => renderFilterField(filter))}
            </div>

            <div className="flex justify-end mt-4 pt-4 border-t border-border">
                <Button
                    type="button"
                    onClick={onApply}
                    disabled={disabled}
                    size="sm"
                >
                    Aplicar Filtros
                </Button>
            </div>
        </div>
    )
}
