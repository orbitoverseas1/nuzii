import { type SchemaTypeDefinition } from "sanity";

import { blockContentType } from "./blockContentType";
import { categoryType } from "./categoryType";
import { productType } from "./productType";
import { orderType } from "./orderType";
import { shopHeroType } from "./shopHeroType";
import { shopBannerType } from "./shopBannerType";
import { productShowcaseType } from "./productShowcaseType";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    blockContentType,
    categoryType,
    productType,
    orderType,
    shopHeroType,
    shopBannerType,
    productShowcaseType,
  ],
};
