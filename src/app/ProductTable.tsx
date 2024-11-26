"use client";
import React, { useState } from "react";

export default function ProductTable({ products }: { products: any[] }) {
  const [expanded, setExpanded] = useState<{ [key: number]: boolean }>({});
  const [expandedSecondary, setExpandedSecondary] = useState<{
    [key: number]: { [key: number]: boolean };
  }>({});

  const toggleExpand = (id: number) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleSecondaryExpand = (
    productId: number,
    primaryVariantId: number
  ) => {
    setExpandedSecondary((prev) => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        [primaryVariantId]: !prev[productId]?.[primaryVariantId],
      },
    }));
  };

  return (
    <table className="min-w-full bg-white">
      <thead>
        <tr>
          <th className="py-2 px-4 border-b w-[35%] bg-gray-100">
            Product Name
          </th>
          <th className="py-2 px-4 border-b w-[10%]">Price</th>
          <th className="py-2 px-4 border-b w-[10%]">Discount</th>
          <th className="py-2 px-4 border-b w-[10%]">Inventory</th>
          <th className="py-2 px-4 border-b w-[5%]">Active</th>
          <th className="py-2 px-4 border-b w-[10%]">Lead Time</th>
          <th className="py-2 px-4 border-b w-[10%]">Description</th>
          <th className="py-2 px-4 border-b w-[5%]">Category</th>
        </tr>
      </thead>
      <tbody>
        {products.map((product) => (
          <React.Fragment key={product.id}>
            <tr>
              <td
                className="py-2 px-4 border-b cursor-pointer bg-gray-100"
                onClick={() => toggleExpand(product.id)}
              >
                <div className="flex gap-3 items-center">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-12 h-12 object-cover rounded-full"
                  />
                  {product.title}
                </div>
              </td>
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
            </tr>

            {expanded[product.id] &&
              product.primaryVariants.map((pv: an) => (
                <React.Fragment key={pv.id}>
                  <tr>
                    <td
                      className="py-2 px-4 border-b cursor-pointer bg-gray-100"
                      onClick={() => toggleSecondaryExpand(product.id, pv.id)}
                    >
                      <div className="ml-4 flex items-center gap-3">
                        <img
                          src={product.image}
                          alt={product.title}
                          className="w-10 h-10 object-cover rounded-full"
                        />
                        <span>{pv.name}</span>
                      </div>
                    </td>
                    <td className="py-2 px-4 border-b">{pv.price}</td>
                    <td className="py-2 px-4 border-b">
                      {pv.discountPercentage}
                    </td>
                    <td className="py-2 px-4 border-b">{pv.inventory}</td>
                    <td className="py-2 px-4 border-b">-</td>
                    <td className="py-2 px-4 border-b">-</td>
                    <td className="py-2 px-4 border-b">-</td>
                    <td className="py-2 px-4 border-b">-</td>
                  </tr>

                  {expandedSecondary[product.id]?.[pv.id] &&
                    pv.secondaryVariants.map((sv: any, svIndex: number) => (
                      <tr key={svIndex}>
                        <td className="py-2 px-4 border-b pl-16 bg-gray-100">
                          {sv.name}
                        </td>
                        <td className="py-2 px-4 border-b">{sv.price}</td>
                        <td className="py-2 px-4 border-b">
                          {sv.discountPercentage}
                        </td>
                        <td className="py-2 px-4 border-b">{sv.inventory}</td>
                        <td className="py-2 px-4 border-b">-</td>
                        <td className="py-2 px-4 border-b">-</td>
                        <td className="py-2 px-4 border-b">-</td>
                        <td className="py-2 px-4 border-b">-</td>
                      </tr>
                    ))}
                </React.Fragment>
              ))}
          </React.Fragment>
        ))}
      </tbody>
    </table>
  );
}
