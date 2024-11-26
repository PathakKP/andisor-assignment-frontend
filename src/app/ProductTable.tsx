"use client";
import React, { useState } from "react";

export default function ProductTable({ products }: { products: any[] }) {
  const [expanded, setExpanded] = useState<{ [key: number]: boolean }>({});

  const toggleExpand = (id: number) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <table className="min-w-full bg-white">
      <thead>
        <tr>
          <th className="py-2 px-4 border-b">Title</th>
          <th className="py-2 px-4 border-b">Price</th>
          <th className="py-2 px-4 border-b">Discount</th>
          <th className="py-2 px-4 border-b">Inventory</th>
          <th className="py-2 px-4 border-b">Active</th>
          <th className="py-2 px-4 border-b">Lead Time</th>
          <th className="py-2 px-4 border-b">Description</th>
          <th className="py-2 px-4 border-b">Category</th>
          <th className="py-2 px-4 border-b">Image</th>
        </tr>
      </thead>
      <tbody>
        {products.map((product) => (
          <React.Fragment key={product.id}>
            <tr
              onClick={() => toggleExpand(product.id)}
              className="cursor-pointer hover:bg-gray-100"
            >
              <td className="py-2 px-4 border-b">{product.title}</td>
              <td className="py-2 px-4 border-b">{product.price}</td>
              <td className="py-2 px-4 border-b">
                {product.discountPercentage}
              </td>
              <td className="py-2 px-4 border-b">{product.inventory}</td>
              <td className="py-2 px-4 border-b">
                {product.active ? "Yes" : "No"}
              </td>
              <td className="py-2 px-4 border-b">{product.leadTime}</td>
              <td className="py-2 px-4 border-b">{product.description}</td>
              <td className="py-2 px-4 border-b">{product.category}</td>
              <td className="py-2 px-4 border-b">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-16 h-16 object-cover"
                />
              </td>
            </tr>
            {expanded[product.id] &&
              product.primaryVariants.map((pv: any) => (
                <tr key={pv.id} className="bg-gray-50">
                  <td className="py-2 px-4 border-b" colSpan={9}>
                    <div className="flex items-center">
                      <span className="mr-2">{pv.name}</span>
                      <span className="mr-2">{pv.price}</span>
                      <span className="mr-2">{pv.discountPercentage}</span>
                      <span>{pv.inventory}</span>
                    </div>
                  </td>
                </tr>
              ))}
          </React.Fragment>
        ))}
      </tbody>
    </table>
  );
}
