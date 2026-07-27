import Container from "@/components/Container";
import CategoryProducts from "@/components/new/CategoryProducts";
import { getAllCategories } from "@/sanity/helpers";
import React from "react";

const CategoryPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;
  const categories = await getAllCategories();

  return (
    <div>
      <Container className="max-w-[1600px] py-6 md:px-6 md:py-10">
        <CategoryProducts categories={categories} slug={slug} />
      </Container>
    </div>
  );
};

export default CategoryPage;
