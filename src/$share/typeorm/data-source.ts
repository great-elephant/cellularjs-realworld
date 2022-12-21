import { DataSource } from 'typeorm';

export const DEFAULT_DATA_SOURCE = 'default';

export const dataSourceStorage = new Map<string | symbol, DataSource>();
