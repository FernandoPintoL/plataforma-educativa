// Application Layer: Generic hook for entity management - Updated with notifications
import { useState, useCallback, useEffect } from 'react';
import { router } from '@inertiajs/react';
import type { BaseEntity, BaseService, Filters, BaseFormData } from '@/domain/generic';
import NotificationService from '@/services/notification.service';

export function useGenericEntities<T extends BaseEntity, F extends BaseFormData>(
  service: BaseService<T, F>
) {
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Búsqueda de entidades con notificación
  const searchEntities = useCallback((filters: Filters) => {
    setIsLoading(true);

    if (filters.q && filters.q.trim()) {
      NotificationService.info(`Buscando: "${filters.q}"`);
    }

    service.search(filters);

    // Resetear loading después de un breve delay
    setTimeout(() => setIsLoading(false), 500);
  }, [service]);

  // Eliminar entidad con confirmación elegante
  const deleteEntity = useCallback(async (entity: T, entityName: string) => {
    const entityDisplayName = 'nombre' in entity ? String(entity.nombre) : `ID: ${entity.id}`;

    const confirmed = await NotificationService.confirm(
      `¿Estás seguro de que quieres eliminar ${entityName} "${entityDisplayName}"?`,
      {
        title: `Eliminar ${entityName}`,
        confirmText: 'Sí, eliminar',
        cancelText: 'Cancelar'
      }
    );

    if (confirmed) {
      setIsLoading(true);

      // Crear una promesa para el toast de loading/success/error
      const deletePromise = new Promise<void>((resolve, reject) => {
        router.delete(service.destroyUrl(entity.id), {
          preserveState: true,
          onSuccess: () => {
            router.reload({ only: [service.constructor.name.toLowerCase().replace('service', '')] });
            resolve();
          },
          onError: (errors) => {
            reject(new Error('Error al eliminar el registro'));
          },
          onFinish: () => {
            setIsLoading(false);
          }
        });
      });

      // Mostrar notificación con promesa
      NotificationService.promise(deletePromise, {
        loading: `Eliminando ${entityName}...`,
        success: `${entityName} eliminado correctamente`,
        error: `Error al eliminar ${entityName}`
      });
    }
  }, [service]);

  // Navegar a editar entidad
  const navigateToEdit = useCallback((entity: T) => {
    router.visit(service.editUrl(entity.id));
  }, [service]);

  // Manejar cambios en el campo de búsqueda - sin restricciones
  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
  }, []);

  // Ejecutar búsqueda
  const handleSearch = useCallback(() => {
    if (!isLoading) {
      searchEntities({ q: searchQuery.trim() });
    }
  }, [searchQuery, searchEntities, isLoading]);

  // Limpiar filtros
  const clearFilters = useCallback(() => {
    setSearchQuery('');
    searchEntities({});
  }, [searchEntities]);

  // Método para sincronizar con filtros externos (llamado desde GenericContainer)
  const syncWithFilters = useCallback((externalFilters: { q?: string }) => {
    if (externalFilters?.q !== undefined && externalFilters.q !== searchQuery) {
      setSearchQuery(externalFilters.q || '');
    }
  }, [searchQuery]);

  return {
    // Estado
    isLoading,
    searchQuery,

    // Acciones
    searchEntities,
    deleteEntity,
    navigateToEdit,
    handleSearchChange,
    handleSearch,
    clearFilters,
    syncWithFilters,
  };
}
