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

      // Orders are split so payments that need a human never sit unnoticed in
      // the flat list: "Awaiting payment" is anything that left for iPay and
      // never came back, "Needs attention" is anything the callback could not
      // resolve cleanly.
      S.listItem()
        .title("Orders")
        .id("orders")
        .child(
          S.list()
            .title("Orders")
            .items([
              S.listItem()
                .title("All Orders")
                .id("allOrders")
                .child(
                  S.documentTypeList("order")
                    .title("All Orders")
                    .defaultOrdering([{ field: "orderDate", direction: "desc" }])
                ),
              S.listItem()
                .title("Awaiting payment")
                .id("ordersAwaitingPayment")
                .child(
                  S.documentTypeList("order")
                    .title("Awaiting payment")
                    .filter('paymentStatus == "awaiting_payment"')
                    .defaultOrdering([{ field: "orderDate", direction: "asc" }])
                ),
              S.listItem()
                .title("Needs attention")
                .id("ordersNeedsAttention")
                .child(
                  S.documentTypeList("order")
                    .title("Needs attention")
                    .filter(
                      'paymentStatus == "pending_settlement" || (paymentStatus == "failed" && status != "cancelled")'
                    )
                    .defaultOrdering([{ field: "orderDate", direction: "desc" }])
                ),
            ])
        ),

      ...S.documentTypeListItems().filter(
        (item) =>
          item.getId() &&
          !["product", "order", "homepageLooks", "homepageProductSections"].includes(
            item.getId()!
          )
      ),
    ]);
