// Data Layer: Tipos de pago service
import Controllers from '@/actions/App/Http/Controllers';
import { GenericService } from '@/services/generic.service';
import type { Filters, Id } from '@/domain/shared';
import type { TipoPago, TipoPagoFormData } from '@/domain/tipos-pago';

export class TiposPagoService extends GenericService<TipoPago, TipoPagoFormData> {
  constructor() {
    super('tipos-pago');
  }

  // URL generators using the Controllers actions
  indexUrl(params?: { query?: Filters }) {
    return Controllers.TipoPagoController.index(params).url;
  }

  createUrl() {
    return Controllers.TipoPagoController.create().url;
  }

  editUrl(id: Id) {
    return Controllers.TipoPagoController.edit(Number(id)).url;
  }

  storeUrl() {
    return Controllers.TipoPagoController.store().url;
  }

  updateUrl(id: Id) {
    return Controllers.TipoPagoController.update(Number(id)).url;
  }

  destroyUrl(id: Id) {
    return Controllers.TipoPagoController.destroy(Number(id)).url;
  }

  // Override validation for specific fields
  validateData(data: TipoPagoFormData): string[] {
    const errors = super.validateData(data);

    if (!data.codigo || String(data.codigo).trim().length === 0) {
      errors.push('El código es requerido');
    }

    if (data.codigo && String(data.codigo).length > 255) {
      errors.push('El código no puede tener más de 255 caracteres');
    }

    return errors;
  }
}

const tiposPagoService = new TiposPagoService();
export default tiposPagoService;
