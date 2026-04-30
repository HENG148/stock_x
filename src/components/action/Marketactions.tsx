'use client'

import { buyNow, createListing, placeBid } from "@/src/server/market";
import { SIZES } from "@/src/types/type";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Mode = "buy" | "bid" | "sell" | null

interface MarketActionProps {
  productId: string;
  userId?: string;
  lowestAsk: string | null;
  highestBid: string | null;
  price: string
  availableSizes: Set<string | null>;
  sizePriceMap: Record<string, string>;
}

export function MarketAction({
  productId,
  userId,
  lowestAsk,
  highestBid,
  price,
  availableSizes = new Set(),
  sizePriceMap = {}
}: MarketActionProps) {
  const router = useRouter()
  const [selectedSize, setSelectedSize] = useState("")
  const [mode, setMode] = useState<Mode>(null);
  const [bidAmount, setBidAmount] = useState("");
  const [askAmount, setAskAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [currentPrice, setCurrentPrice] = useState<string>(lowestAsk ?? price)

  const handleSizeSelect = (size: string) => {
    setSelectedSize(size)
    setError("")
    if (sizePriceMap[size]) {
      setCurrentPrice(sizePriceMap[size])
    } else {
      setCurrentPrice(lowestAsk ?? price)
    }
  }

  const handleBuyNow = async () => {
    if (!userId) return router.push("/login")
    if (!selectedSize) return setError("Please select a size")
    setLoading(true)
    setError("")
    try {
      await buyNow({ productId, buyerId: userId, size: selectedSize })
      setSuccess("Order placed successfully!");
      setTimeout(() => router.push("/profile/buying"), 1500);
    } catch (e: any) {
      setError(e.message ?? "No listing available for this size");
    } finally {
      setLoading(false)
    }
  }
  
  const handlePlaceBid = async () => {
    if (!userId) return router.push("/login");
    if (!selectedSize) return setError("Please select a size");
    if (!bidAmount || Number(bidAmount) <= 0) return setError("Enter a valid bid amount");
    setLoading(true);
    setError("");
    try {
      await placeBid({ productId, buyerId: userId, bidPrice: Number(bidAmount), size: selectedSize });
      setSuccess("Bid placed successfully!");
      setMode(null);
    } catch {
      setError("Failed to place bid");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateListing = async () => {
    if (!userId) return router.push("/login");
    if (!selectedSize) return setError("Please select a size")
    if (!askAmount || Number(askAmount) <= 0) return setError("Enteer a valid ask price");
    setLoading(true)
    setError("");
    try {
      await createListing({ productId, sellerId: userId, askPrice: Number(askAmount), size: selectedSize });
      setSuccess("Listing created!");
      setMode(null);
    } catch {
      setError("Failed to create listing");
    } finally {
      setLoading(false);
    }
  }

  const [soldOut, setSoldOut] = useState<number>(238)
  useEffect(() => {
    setSoldOut(Math.floor(Math.random()*400)+50)
  }, [])

  return (
    <div>
      <div className="mb-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-gray-700">Size:</span>
          <span className="text-xs text-gray-400">US Men's</span>
        </div>
        <div className="grid grid-cols-6 gap-1.5">
          {SIZES.map((size) => {
            const available = availableSizes.has(size)
            return (
              <button
              key={size}
                // onClick={() => { setSelectedSize(size); setError(""); }}
                onClick={()=> handleSizeSelect(size)}
              disabled={!available}
              className={`py-2 text-xs font-medium rounded-lg border transition-all cursor-pointer ${
                selectedSize === size
                  ? "border-gray-900 bg-gray-900 text-white"
                  : available
                  ? "border-gray-200 hover:border-gray-900 hover:bg-gray-900 hover:text-white bg-white text-gray-700"
                  : "border-gray-100 bg-gray-50 text-gray-300 cursor-not-allowed line-through"
              }`}
            >
              {size}
            </button>
            )
          })}
        </div>
      </div>
 
      <div className="border border-gray-200 rounded-xl p-5 mb-4">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-xs text-gray-400 font-medium mb-0.5">Buy Now for</p>
            <p className="text-3xl font-black text-gray-900">
              ${Number(currentPrice).toLocaleString()}
            </p>
          </div>
          <div className="flex items-center gap-1.5 bg-yellow-50 px-3 py-1.5 rounded-lg">
            <span className="text-base">⚡</span>
            <p className="text-xs font-bold text-gray-800">
              {soldOut} Sold in Last 3 Days!
            </p>
          </div>
        </div>

        {error && <p className="text-xs text-red-500 mb-3">{error}</p>}
        {success && <p className="text-xs text-green-600 mb-3">{success}</p>}
 
        {/* Buy Now / Make Offer */}
        {mode === null && (
          <div className="grid grid-cols-2 gap-3 mb-4">
            <button
              onClick={() => { setMode("bid"); setError(""); }}
              className="py-3 rounded-full border-2 border-gray-900 text-sm font-bold text-gray-900 hover:bg-gray-50 transition-colors bg-white cursor-pointer"
            >
              Make Offer
            </button>
            <button
              onClick={handleBuyNow}
              disabled={loading}
              className="py-3 rounded-full bg-[#08a05c] text-sm font-bold text-white hover:bg-[#069050] transition-colors border-none cursor-pointer disabled:opacity-50"
            >
              {loading ? "Processing..." : "Buy Now"}
            </button>
          </div>
        )}
 
        {mode === "bid" && (
          <div className="mb-4">
            <p className="text-sm font-semibold text-gray-700 mb-2">Your Offer Price</p>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                <input
                  type="number"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full pl-7 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-gray-900"
                />
              </div>
              <button
                onClick={handlePlaceBid}
                disabled={loading}
                className="px-4 py-2.5 bg-gray-900 text-white text-sm font-bold rounded-lg border-none cursor-pointer disabled:opacity-50"
              >
                {loading ? "..." : "Place Bid"}
              </button>
              <button
                onClick={() => setMode(null)}
                className="px-3 py-2.5 border border-gray-200 text-sm rounded-lg cursor-pointer bg-white"
              >
                ✕
              </button>
            </div>
          </div>
        )}
 
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">
            Last Sale:{" "}
            <span className="font-semibold text-gray-900">
              ${Number(price).toLocaleString()}
            </span>
          </span>
          <button className="text-[#08a05c] font-semibold text-xs hover:underline bg-transparent border-none cursor-pointer">
            View Market Data
          </button>
        </div>
      </div>
 
      {mode === null && (
        <div className="text-center mb-6">
          <button
            onClick={() => { setMode("sell"); setError(""); }}
            className="text-[#08a05c] font-bold text-sm bg-transparent border-none cursor-pointer hover:underline"
          >
            Sell Now for ${Number(highestBid ?? price).toLocaleString()} or Ask for More →
          </button>
        </div>
      )}

      {mode === "sell" && (
        <div className="border border-gray-200 rounded-xl p-5 mb-4">
          <p className="text-sm font-semibold text-gray-700 mb-2">Your Ask Price</p>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
              <input
                type="number"
                value={askAmount}
                onChange={(e) => setAskAmount(e.target.value)}
                placeholder="0.00"
                className="w-full pl-7 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-gray-900"
              />
            </div>
            <button
              onClick={handleCreateListing}
              disabled={loading}
              className="px-4 py-2.5 bg-[#08a05c] text-white text-sm font-bold rounded-lg border-none cursor-pointer disabled:opacity-50"
            >
              {loading ? "..." : "List Item"}
            </button>
            <button
              onClick={() => setMode(null)}
              className="px-3 py-2.5 border border-gray-200 text-sm rounded-lg cursor-pointer bg-white"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}