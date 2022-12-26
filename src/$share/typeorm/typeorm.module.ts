import { Module, ExtModuleMeta, OnInit } from '@cellularjs/di';
import { getLogger } from '@cellularjs/logger'
import { DataSource, DataSourceOptions } from 'typeorm';
import { ConnectionMetadataBuilder } from 'typeorm/connection/ConnectionMetadataBuilder'
import { dataSourceStorage, DEFAULT_DATA_SOURCE } from './data-source';

export const DEFAULT_DB = 'default';

@Module({})
export class TypeOrmModule {
  static initialize(options: DataSourceOptions) {
    return getRealTypeOrmModule(options);
  }

  static forFeature(entities: any[]): ExtModuleMeta {
    return {
      extModule: TypeOrmModule,
      exports: [getRealTypeOrmModule2(entities)],
    };
  }
}

function getRealTypeOrmModule2(entities: any[]) {
  @Module({})
  class RealTypeOrmModule implements OnInit {
    async onInit() {
      const dataSource = dataSourceStorage.get(DEFAULT_DATA_SOURCE);

      if (!dataSource) {
        throw new Error(
          'You need initialize data source before adding entities.\n' +
          `(Example: https://github.com/great-elephant/cellularjs-realworld/tree/master/src/%24share)`,
        );
      }

      const metadataBuilder = new ConnectionMetadataBuilder(dataSource);
      const entityMetadatas = await metadataBuilder.buildEntityMetadatas(entities);
      dataSource.entityMetadatas.push(...entityMetadatas);
      await dataSource.synchronize();

      const logger = getLogger(TypeOrmModule.name);
      logger.info(`${entities.map(e => e.name).join(', ')} added`);
    }
  }

  return RealTypeOrmModule;
}

function getRealTypeOrmModule(options: DataSourceOptions) {
  @Module({})
  class RealTypeOrmModule implements OnInit {
    async onInit() {
      const logger = getLogger(TypeOrmModule.name);
      const opts = options;

      const dataSourceName = opts.name || DEFAULT_DB;

      if (dataSourceStorage.has(dataSourceName)) {
        throw new Error(`Database "${dataSourceName}" is exists`)
      }

      try {
        const dataSource = await (new DataSource(opts)).initialize();

        dataSourceStorage.set(DEFAULT_DATA_SOURCE, dataSource);

        logger.info(`Data source(${dataSourceName}) initialized`);

      } catch (err) {
        logger.error(`failed to connect to DB\n${err.stack || err}`);
        throw err;
      }
    }
  }

  return RealTypeOrmModule;
}
