import { AppDataSource } from '../data-source';

export const dbCreateEntity = async (entityType, params) => {
  const entity = AppDataSource.getRepository(entityType).create(params);

  await AppDataSource.getRepository(entityType).save(entity);

  return entity;
};

export const dbFindByFieldName = async (entityType, fieldName, fieldValue) => {
  const whereClause = {};

  // Check if the field is a property of a related entity
  if (fieldName.includes('.')) {
    const [relationName, propertyName] = fieldName.split('.');
    whereClause[relationName] = { [propertyName]: fieldValue };
  } else {
    // Handle the case where the field is a property of the main entity
    whereClause[fieldName] = fieldValue;
  }

  return await AppDataSource.getRepository(entityType).findOne({
    where: whereClause,
  });
};

export const dbUpdateEntity = async (entityType, id, params) => {
  const entity = await AppDataSource.getRepository(entityType).findOne({ where: { id } });

  AppDataSource.getRepository(entityType).merge(entity, params);

  await AppDataSource.getRepository(entityType).save(entity);

  return entity;
};

// get all entities with a relationship
export const dbGetAllEntities = async (entityType, relations) => {
  return await AppDataSource.getRepository(entityType).find({ relations });
};
