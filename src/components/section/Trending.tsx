import { db } from "@/src/db";
import { products } from "@/src/db/schema";
import { eq } from "drizzle-orm";
import Image from "next/image";
import Link from "next/link";

type TrendingProduct = {
  id: string;
  name: string;
  brand: string | null;
  imageUrl: string | null;
  lowestAsk: string | null;
};

export default async function TrendingSection() {
  const trendingShoes = await db
    .select({
      id: products.id,
      name: products.name,
      brand: products.brand,
      imageUrl: products.imageUrl,
      lowestAsk: products.lowestAsk,
    })
    .from(products)
    .where(eq(products.category, "trending"))
    .limit(10);

  if (trendingShoes.length === 0) return null;

  return (
    <section className="py-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-black text-gray-900">Trending Now</h2>
          <p className="text-sm text-gray-400 mt-0.5">Most wanted styles right now</p>
        </div>
        <Link
          href="/trending"
          className="text-sm font-semibold text-[#08a05c] hover:underline"
        >
          View All →
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {trendingShoes.map((shoe) => (
          <TrendingCard key={shoe.id} shoe={shoe} />
        ))}
      </div>
    </section>
  );
}

function TrendingCard({ shoe }: { shoe: TrendingProduct }) {
  return (
    <Link href={`/products/${shoe.id}`} className="group no-underline">
      <div className="rounded-2xl border border-gray-100 overflow-hidden hover:border-gray-300 hover:shadow-md transition-all duration-200">
        <div className="relative aspect-square bg-gray-50">
          {shoe.imageUrl ? (
            <Image
              src={shoe.imageUrl}
              alt={shoe.name}
              fill
              className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-5xl">
              👟
            </div>
          )}
        </div>

        <div className="p-3">
          {shoe.brand && (
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-0.5">
              {shoe.brand}
            </p>
          )}
          <p className="text-sm font-semibold text-gray-900 leading-tight line-clamp-2">
            {shoe.name}
          </p>
          <div className="mt-2 flex items-center justify-between">
            <div>
              <p className="text-[10px] text-gray-400">Lowest Ask</p>
              <p className="text-sm font-black text-gray-900">
                ${Number(shoe.lowestAsk ?? 0).toLocaleString()}
              </p>
            </div>
            <button className="text-[11px] font-bold text-white bg-[#08a05c] px-3 py-1.5 rounded-full hover:bg-[#069050] transition-colors">
              Buy
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}