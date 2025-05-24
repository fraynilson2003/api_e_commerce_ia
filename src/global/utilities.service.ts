import { Injectable } from '@nestjs/common';

@Injectable()
export class UtilitiesService {
  generateSlug(name: string): string {
    return name
      .toLowerCase()
      .normalize('NFD') // quita acentos
      .replace(/[\u0300-\u036f]/g, '') // elimina caracteres diacríticos
      .replace(/[^a-z0-9\s-]/g, '') // elimina caracteres no válidos
      .trim()
      .replace(/\s+/g, '-') // reemplaza espacios por guiones
      .replace(/-+/g, '-'); // elimina guiones repetidos
  }
}
