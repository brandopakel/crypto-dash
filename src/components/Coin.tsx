'use client';
import { useState } from "react";
import ProductIdResolverCB from "./ProductIdResolver_cb";

export default function Coin(){
    const [productId, setProductId] = useState<string | null>(null);

    return(
    <div>
        <ProductIdResolverCB onResolved={(pid) => setProductId(pid)} />

      {productId && (
        <div className="mt-4 text-green-300">
          ✅ You selected: <strong>{productId}</strong>
        </div>
      )}
    </div>
  );
}