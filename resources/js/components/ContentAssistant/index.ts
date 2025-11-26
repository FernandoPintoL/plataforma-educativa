/**
 * Barrel export para ContentAssistant
 * Facilita las importaciones desde otros componentes
 */

export { default as ContentAssistant } from './ContentAssistant'
export { default as AssistedForm } from './AssistedForm'
export { default as SuggestionsPanel } from './SuggestionsPanel'

export type {
  ContentType,
  DifficultyLevel,
  Course,
  AnalysisResponse,
  ContentAnalysis,
  ContentSuggestions,
  AnalysisState,
  ContentAssistantProps,
  AssistedFormProps,
  SuggestionsPanelProps,
} from './types'
