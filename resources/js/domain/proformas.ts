// Domain: Proformas
import type { Id } from './shared';
import type { BaseEntity, BaseFormData } from './generic';
import type { Cliente } from './clientes';
import type { Usuario } from './usuarios';
import type { EstadoDocumento } from './estados-documento';
import type { Moneda } from './monedas';
import type { Producto } from './productos';

export interface Proforma extends BaseEntity {
    id: Id;
    numero: string;
    fecha: string;
    subtotal: number;
    descuento: number;
    impuesto: number;
    total: number;
    observaciones?: string;
    cliente_id: Id;
    usuario_id: Id;
    estado_documento_id: Id;
    moneda_id: Id;
    canal_origen?: 'APP_EXTERNA' | 'WEB' | 'PRESENCIAL';
    requiere_envio?: boolean;

    // Relaciones
    cliente?: Cliente;
    usuario?: Usuario;
    estado_documento?: EstadoDocumento;
    moneda?: Moneda;
    detalles?: ProformaDetalle[];

    // Timestamps
    created_at: string;
    updated_at: string;
}

export interface ProformaDetalle extends BaseEntity {
    id: Id;
    proforma_id: Id;
    producto_id: Id;
    cantidad: number;
    precio_unitario: number;
    descuento: number;
    subtotal: number;
    producto?: Producto;
}

export interface ProformaFormData extends BaseFormData {
    id?: Id;
    numero: string;
    fecha: string;
    subtotal: number;
    descuento: number;
    impuesto: number;
    total: number;
    observaciones?: string;
    cliente_id: Id;
    usuario_id: Id;
    estado_documento_id: Id;
    moneda_id: Id;
    canal_origen?: 'APP_EXTERNA' | 'WEB' | 'PRESENCIAL';
    requiere_envio?: boolean;
    detalles: ProformaDetalleFormData[];
}

export interface ProformaDetalleFormData extends BaseFormData {
    id?: Id;
    producto_id: Id;
    cantidad: number;
    precio_unitario: number;
    descuento: number;
    subtotal: number;
}