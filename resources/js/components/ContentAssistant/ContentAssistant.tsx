/**
 * ContentAssistant - Componente genérico reutilizable
 *
 * Permite crear tareas, evaluaciones u otros contenidos de dos formas:
 * 1. Con asistencia de IA (analiza el título y sugiere contenido)
 * 2. Manualmente (formulario vacío tradicional)
 *
 * Reutilizable para:
 * - Tareas
 * - Evaluaciones
 * - Recursos educativos
 * - Otros contenidos futuros
 */

import React, { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle, Sparkles, FileText } from 'lucide-react'
import AssistedForm from './AssistedForm'
import type { ContentAssistantProps, ContentSuggestions } from './types'

export default function ContentAssistant({
  contentType,
  courseId,
  onSuggestionsApplied,
  initialData,
  children,
  title = 'Crear Contenido',
  courses = []
}: ContentAssistantProps) {
  const [activeTab, setActiveTab] = useState<'assisted' | 'manual'>('assisted')

  const getContentTypeLabel = () => {
    switch (contentType) {
      case 'tarea':
        return 'tarea'
      case 'evaluacion':
        return 'evaluación'
      case 'recurso':
        return 'recurso'
      default:
        return 'contenido'
    }
  }

  const getIcon = () => {
    return activeTab === 'assisted' ? (
      <Sparkles className="w-5 h-5 text-purple-600" />
    ) : (
      <FileText className="w-5 h-5 text-blue-600" />
    )
  }

  const handleTabChange = (value: string) => {
    setActiveTab(value as 'assisted' | 'manual')
  }

  return (
    <div className="space-y-6">
      {/* Card Principal con Tabs */}
      <Card className="border-2">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2 mb-2">
            {getIcon()}
            <div>
              <CardTitle className="flex items-center gap-2">
                {activeTab === 'assisted' ? (
                  <>
                    <Sparkles className="w-4 h-4" />
                    {title} con Asistencia IA
                  </>
                ) : (
                  <>
                    <FileText className="w-4 h-4" />
                    {title} Manual
                  </>
                )}
              </CardTitle>
              <CardDescription>
                {activeTab === 'assisted'
                  ? `El agente IA te ayudará a crear una ${getContentTypeLabel()} analizando el título`
                  : `Crea una ${getContentTypeLabel()} rellenando el formulario manualmente`}
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            {/* Selector de Modo */}
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="assisted" className="gap-2">
                <Sparkles className="w-4 h-4" />
                <span className="hidden sm:inline">Con IA</span>
                <span className="sm:hidden">IA</span>
              </TabsTrigger>
              <TabsTrigger value="manual" className="gap-2">
                <FileText className="w-4 h-4" />
                <span className="hidden sm:inline">Manual</span>
                <span className="sm:hidden">Manual</span>
              </TabsTrigger>
            </TabsList>

            {/* Modo Asistido */}
            <TabsContent value="assisted" className="space-y-4 mt-0">
              <AssistedForm
                contentType={contentType}
                courseId={courseId}
                onSuggestionsApplied={onSuggestionsApplied}
                courses={courses}
              />
            </TabsContent>

            {/* Modo Manual */}
            <TabsContent value="manual" className="space-y-4 mt-0">
              <Alert className="border-blue-200 bg-blue-50">
                <AlertCircle className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-800">
                  Estás creando una {getContentTypeLabel()} sin asistencia de IA.
                  Puedes rellenar el formulario manualmente tal como lo hacías antes.
                </AlertDescription>
              </Alert>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Formulario Personalizado (tareas o evaluaciones) */}
      {/* Este es el formulario específico de cada tipo de contenido */}
      {children}
    </div>
  )
}
