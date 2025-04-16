import { DataSource } from 'typeorm';
import { User } from './entity/user.entity';
import { BellySafeHistory } from './entity/belly-safe-history.entity';
import { BannerBellySafe } from './entity/banner-belly-safe.entity';
import { Banner } from './entity/banner.entity';
import { QuestionnaireStage } from './entity/stage.entity';
import { BannerQuestionsAndAnswersResult } from './entity/banner-questions-and-answers-result.entity';
import { ProductStorage } from './entity/product-storage.entity';
import { BannerProduct } from './entity/banner-product.entity';
import { ProductCategory } from './entity/product-category.entity';
import { BannerDesignation } from './entity/banner-designation.entity';
import { BannerProductCategory } from './entity/banner-product-category.entity';
import { BannerQuestionsAndAnswers } from './entity/banner-questions-and-answers.entity';
import { WishListItem } from './entity/wishlist-item.entity';
import { ProductCategoryItem } from './entity/product-category-item.entity';
import { Event } from './entity/event.entity';
import { ProductSuperCategoryDesignationMapping } from './entity/product-super-category-designation-mapping.entity';
import { Product } from './entity/product.entity';
import { ProductSuperCategory } from './entity/product-super-category.entity';
import { ProductCategoryDesignationMapping } from './entity/product-category-designation-mapping.entity';
import { Calendar } from './entity/calendar.entity';
import { QuestionsAndAnswersSessions } from './entity/questions-and-answers-sessions.entity';

let dataSource: DataSource | null = null;

export const getDbConnection = async (): Promise<DataSource> => {
  if (dataSource && dataSource.isInitialized) {
    return dataSource;
  }

  // Get database connection parameters from environment variables or use defaults
  const dbHost = process.env.DB_HOST || 'postgres';
  const dbPort = parseInt(process.env.DB_PORT || '5432');
  const dbUsername = process.env.DB_USERNAME || 'postgres';
  const dbPassword = process.env.DB_PASSWORD || '890803306';
  const dbDatabase = process.env.DB_DATABASE || 'promom_dev';

  dataSource = new DataSource({
    type: 'postgres',
    host: dbHost,
    port: dbPort,
    username: dbUsername,
    password: dbPassword,
    database: dbDatabase,
    entities: [
      User,
      BannerBellySafe,
      BellySafeHistory,
      Banner,
      QuestionnaireStage,
      BannerQuestionsAndAnswersResult,
      ProductStorage,
      BannerProduct,
      ProductCategory,
      BannerDesignation,
      BannerProductCategory,
      BannerQuestionsAndAnswers,
      WishListItem,
      ProductCategoryItem,
      Event,
      ProductSuperCategoryDesignationMapping,
      Product,
      ProductSuperCategory,
      ProductCategoryDesignationMapping,
      Calendar,
      QuestionsAndAnswersSessions,
    ],
    synchronize: false,
  });

  await dataSource.initialize();
  console.log('Database connection established successfully');
  return dataSource;
};
