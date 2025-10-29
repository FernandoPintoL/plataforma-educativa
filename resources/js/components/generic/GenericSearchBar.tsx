// Presentation Layer: Generic search bar component
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, X } from 'lucide-react'

interface GenericSearchBarProps {
    value: string
    onChange: (value: string) => void
    onSearch: (e?: React.FormEvent) => void
    onClear?: () => void
    placeholder?: string
    disabled?: boolean
    showClearButton?: boolean
    className?: string
}

export default function GenericSearchBar({
    value,
    onChange,
    onSearch,
    onClear,
    placeholder = 'Buscar...',
    disabled = false,
    showClearButton = true,
    className = ''
}: GenericSearchBarProps) {
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            onSearch()
        }
    }

    const handleClear = () => {
        onChange('')
        if (onClear) {
            onClear()
        }
    }

    return (
        <form onSubmit={onSearch} className={`flex items-center gap-2 ${className}`}>
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    disabled={disabled}
                    className="pl-10 pr-10"
                />
                {showClearButton && value && (
                    <button
                        type="button"
                        onClick={handleClear}
                        disabled={disabled}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        aria-label="Limpiar búsqueda"
                    >
                        <X className="h-4 w-4" />
                    </button>
                )}
            </div>
            <Button
                type="submit"
                disabled={disabled}
                className="shrink-0"
            >
                <Search className="h-4 w-4 mr-2" />
                Buscar
            </Button>
        </form>
    )
}
