import Typesense from 'typesense';
import { Product } from './entity/product.entity';
import { QuestionsAndAnswersSessions } from './entity/questions-and-answers-sessions.entity';
import { ProductSuperCategory } from './entity/product-super-category.entity';
import { Event } from './entity/event.entity';
import { WishListItem } from './entity/wishlist-item.entity';
import { ProductCategory } from './entity/product-category.entity';
import { ProductStorage } from './entity/product-storage.entity';
import { BannerQuestionsAndAnswersResult } from './entity/banner-questions-and-answers-result.entity';
import { BellySafeHistory } from './entity/belly-safe-history.entity';
import { Banner } from './entity/banner.entity';
import { User } from './entity/user.entity';
import { BannerBellySafe } from './entity/banner-belly-safe.entity';
import { BannerDesignation } from './entity/banner-designation.entity';
import { BannerProductCategory } from './entity/banner-product-category.entity';
import { BannerProduct } from './entity/banner-product.entity';
import { BannerQuestionsAndAnswers } from './entity/banner-questions-and-answers.entity';
import { ProductCategoryItem } from './entity/product-category-item.entity';
import { ProductSuperCategoryDesignationMapping } from './entity/product-super-category-designation-mapping.entity';
import { ProductCategoryDesignationMapping } from './entity/product-category-designation-mapping.entity';
import { Calendar } from './entity/calendar.entity';
import { QuestionnaireStage } from './entity/stage.entity';
import { EntityTarget } from 'typeorm';

export const typesenseInstance = new Typesense.Client({
  nodes: [
    {
      host: process.env.TYPESENSE_HOST || 'typesense',
      port: parseInt(process.env.TYPESENSE_PORT || '8108'),
      protocol: process.env.TYPESENSE_PROTOCOL || 'http',
    },
  ],
  apiKey: process.env.TYPESENSE_API_KEY || '890803306',
  connectionTimeoutSeconds: 5,
});

interface EntityCollection {
  entity: EntityTarget<any>;
  name: string;
}
// Define entity collections for Typesense
export const entityCollections: EntityCollection[] = [
  { entity: Banner, name: 'banners' },
  { entity: BannerBellySafe, name: 'banner_belly_safe' },
  { entity: BellySafeHistory, name: 'belly_safe_history' },
  { entity: QuestionnaireStage, name: 'questionnaire_stages' },
  { entity: BannerQuestionsAndAnswersResult, name: 'banner_questions_and_answers_results' },
  { entity: ProductStorage, name: 'product_storage' },
  { entity: BannerProduct, name: 'banner_products' },
  { entity: ProductCategory, name: 'product_categories' },
  { entity: BannerDesignation, name: 'banner_designations' },
  { entity: BannerProductCategory, name: 'banner_product_categories' },
  { entity: BannerQuestionsAndAnswers, name: 'banner_questions_and_answers' },
  { entity: WishListItem, name: 'wishlist_items' },
  { entity: ProductCategoryItem, name: 'product_category_items' },
  { entity: Event, name: 'events' },
  {
    entity: ProductSuperCategoryDesignationMapping,
    name: 'product_super_category_designation_mappings',
  },
  { entity: Product, name: 'products' },
  { entity: ProductSuperCategory, name: 'product_super_categories' },
  { entity: ProductCategoryDesignationMapping, name: 'product_category_designation_mappings' },
  { entity: QuestionsAndAnswersSessions, name: 'questions_and_answers_sessions' },
];

// Function to create a collection schema in Typesense
export async function createOrUpdateCollection(collectionName: string, schema: any): Promise<any> {
  // Check if collection exists
  try {
    await typesenseInstance.collections(collectionName).retrieve();
    // If it exists, delete it to recreate with updated schema
    await typesenseInstance.collections(collectionName).delete();
  } catch (_err) {
    console.log(`Collection ${collectionName} doesn't exist yet, will create new.`);
    // Collection doesn't exist, which is fine
  }
  // Create collection with schema
  const result = await typesenseInstance.collections().create(schema);
  return result;
}

// Function to get schema for a given entity
export function getSchemaForEntity(entityName: string): any {
  return {
    name: entityName,
    fields: [
      { name: 'id', type: 'string' },
      { name: 'title', type: 'string', optional: true },
      { name: 'name', type: 'string', optional: true },
      { name: 'description', type: 'string', optional: true },
      { name: 'content', type: 'string', optional: true },
      { name: 'stageId', type: 'int32', optional: true },
      { name: 'result', type: 'string', optional: true },
      { name: 'userId', type: 'int32', optional: true },
      { name: 'categoryId', type: 'int32', optional: true },
      { name: 'bannerBellySafeId', type: 'int32', optional: true },
      { name: 'bannerQuestionsAndAnswersId', type: 'int32', optional: true },
      { name: 'bannerQuestionsAndAnswersResultId', type: 'int32', optional: true },
      { name: 'question', type: 'string', optional: true },
      { name: 'food', type: 'string', optional: true },
      { name: 'calendarId', type: 'int32', optional: true },
      { name: 'address', type: 'string', optional: true },
      { name: 'note', type: 'string', optional: true },
      { name: 'subTitle', type: 'string', optional: true },
      { name: 'asin', type: 'string', optional: true },
      { name: 'categoryItemId', type: 'int32', optional: true },
      { name: 'productStorageId', type: 'int32', optional: true },
      { name: 'collection', type: 'string', facet: true },
      { name: 'text_content', type: 'string', sort: true, optional: false },
    ],
    default_sorting_field: 'text_content',
  };
}

// Process entity data and prepare for indexing
export function prepareDataForIndexing(data: any[], name: string): any[] {
  return data.map((item: any) => {
    const preparedItem: Record<string, any> = {};

    // Extract only primitive values and handle special fields
    for (const key in item) {
      const value = item[key];

      // Skip null values
      if (value === null || value === undefined) {
        continue;
      }

      // Handle ID field - ensure it's a string
      if (key === 'id') {
        preparedItem['id'] = String(value);
        if (name === 'product_storage') {
          preparedItem['productStorageId'] = value;
        }
        continue;
      }

      // Skip complex objects (arrays and objects) except for specific cases
      if (typeof value === 'object') {
        // Special case for events - extract userId from calendar
        if (
          name === 'events' &&
          key === 'calendar' &&
          value &&
          typeof value === 'object' &&
          'userId' in value
        ) {
          preparedItem['userId'] = value.userId;
        }
        continue;
      }

      if (value instanceof Date) {
        preparedItem[key] = value.toISOString();
        continue;
      }

      // Add all other primitive values
      preparedItem[key] = value;
    }

    // Add collection field to identify the source entity type
    preparedItem['collection'] = item.constructor?.name?.toLowerCase() || '';

    // Create a searchable text content field combining relevant text fields
    const textFields = [
      'name',
      'title',
      'description',
      'content',
      'result',
      'question',
      'food',
      'address',
      'note',
      'subTitle',
      'asin',
    ];
    const textContent = textFields
      .map(field => item[field])
      .filter(val => val !== null && val !== undefined && typeof val === 'string')
      .join(' ');

    preparedItem['text_content'] = textContent || ' ';

    return preparedItem;
  });
}

export async function typesenseHealthCheck(): Promise<any> {
  return typesenseInstance.health.retrieve();
}

export async function batchImport(collectionName: string, batch: any[]) {
  return typesenseInstance
    .collections(collectionName)
    .documents()
    .import(batch, { action: 'create' });
}
