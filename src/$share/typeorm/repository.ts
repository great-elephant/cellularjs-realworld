import { Injectable, Optional, addProxy, ProxyHandler, ProxyContext } from '@cellularjs/di';
import { EntityTarget } from 'typeorm';
import { dataSourceStorage, DEFAULT_DATA_SOURCE } from './data-source';
import { QueryRunner } from './key.const';

export const Repository = (entity: EntityTarget<any>) => (aClass) => {
  addProxy(aClass, {
    proxy: RepositoryProxy,
    meta: { entity },
  });

  Injectable()(aClass);

  return aClass;
}

interface RepositoryProxyMeta {
  entity: EntityTarget<any>;
}

class RepositoryProxy implements ProxyHandler {
  constructor(
    @Optional()
    private queryRunner: QueryRunner | undefined,
    private ctx: ProxyContext<RepositoryProxyMeta>,
  ) { }

  async handle() {
    const { queryRunner, ctx } = this;

    const repositoryFactory = queryRunner?.manager || dataSourceStorage.get(DEFAULT_DATA_SOURCE);
    const typeOrmRepository = repositoryFactory.getRepository(ctx.meta.entity);

    return new Proxy(await ctx.next(), {
      get(target, prop) {
        if (prop in typeOrmRepository) {
          return typeOrmRepository[prop];
        }

        if (prop in target) {
          return target[prop];
        }
      },
    });
  }
}
