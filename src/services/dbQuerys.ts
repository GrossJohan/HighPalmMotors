import { AppDataSource } from '../data-source';

// users
export const dbFindByFieldName = async (entityType, fieldName, fieldValue) => {
  const whereClause = {};
  whereClause[fieldName] = fieldValue;

  return await AppDataSource.getRepository(entityType).findOne({
    where: whereClause,
  });
};

export const dbCreateEntity = async (entityType, params) => {
  const entity = AppDataSource.getRepository(entityType).create(params);

  await AppDataSource.getRepository(entityType).save(entity);

  return entity;
};

// get all entities with a relationship
export const dbGetAllEntities = async (entityType, relations) => {
  return await AppDataSource.getRepository(entityType).find({ relations });
};
