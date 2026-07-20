import type { StructureResolver } from "sanity/structure";

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) =>
  S.list()
    .title("Ecommerce Admin")
    .items([
      S.documentTypeListItem("product").title("Products"),
      S.listItem()
        .title("Homepage Looks")
        .id("homepageLooks")
        .child(
          S.document()
            .schemaType("homepageLooks")
            .documentId("homepageLooks")
            .title("Homepage Looks")
        ),      S.listItem()
        .title("Homepage Product Sections")
        .id("homepageProductSections")
        .child(
          S.document()
            .schemaType("homepageProductSections")
            .documentId("homepageProductSections")
            .title("Homepage Product Sections")
        ),

      S.divider(),
      ...S.documentTypeListItems().filter(
        (item) =>
          item.getId() && !["product", "homepageLooks", "homepageProductSections"].includes(item.getId()!)
      ),
    ]);
