import { productsData } from "@/lib/mock-data";

export async function generateStaticParams() {
  return productsData.map((product) => ({
    slug: product.slug,
  }));
}

import ProductDetailClient from "./product-detail-client";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <ProductDetailClient slug={slug} />;
}