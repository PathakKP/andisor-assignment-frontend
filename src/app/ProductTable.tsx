"use client";
import React, { useEffect, useState } from "react";
import { SIZE_ABBREVIATIONS } from "./constants";
import { RightOutlined, DownOutlined } from "@ant-design/icons";
import { Switch, Input, InputNumber, Typography, Pagination } from "antd";
import { getProducts, updateProduct } from "@/services/api";
import { Tooltip } from "antd";

const { Text } = Typography;
const { TextArea } = Input;

export default function ProductTable({
  initialProducts,
  totalProducts,
  initialPage,
  pageSize,
}: {
  initialProducts: any[];
  totalProducts: number;
  initialPage: number;
  pageSize: number;
}) {
  const [expanded, setExpanded] = useState<{ [key: number]: boolean }>({});
  const [expandedSecondary, setExpandedSecondary] = useState<{
    [key: number]: { [key: number]: boolean };
  }>({});
  const [productData, setProductData] = useState(initialProducts);
  const [editProductMode, setEditProductMode] = useState<{
    [key: number]: string | null;
  }>({});
  const [editPrimaryMode, setEditPrimaryMode] = useState<{
    [key: number]: string | null;
  }>({});
  const [editSecondaryMode, setEditSecondaryMode] = useState<{
    [key: number]: string | null;
  }>({});
  const [page, setPage] = useState(initialPage);

  console.log("initialProducts", initialProducts);

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await getProducts(page, pageSize);
      setProductData(response.data.products);
    };
    fetchProducts();
  }, [page, pageSize]);

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

  const isColor = (variantName: string) => {
    const colors = [
      "Red",
      "Blue",
      "Green",
      "Yellow",
      "Black",
      "White",
      "Purple",
      "Orange",
    ];
    return colors.includes(variantName);
  };

  const handleInputChange = (
    itemId: number,
    field: string,
    value: any,
    type: "product" | "primary" | "secondary"
  ) => {
    setProductData((prevData) =>
      prevData.map((product) => {
        if (type === "product" && product.id === itemId) {
          return { ...product, [field]: value };
        }
        if (type === "primary") {
          return {
            ...product,
            primaryVariants: product.primaryVariants.map((pv) =>
              pv.id === itemId ? { ...pv, [field]: value } : pv
            ),
          };
        }
        if (type === "secondary") {
          return {
            ...product,
            primaryVariants: product.primaryVariants.map((pv) => ({
              ...pv,
              secondaryVariants: pv.secondaryVariants.map((sv) =>
                sv.id === itemId ? { ...sv, [field]: value } : sv
              ),
            })),
          };
        }
        return product;
      })
    );
  };

  const handleDoubleClick = (
    itemId: number,
    field: string,
    type: "product" | "primary" | "secondary"
  ) => {
    if (type === "product") {
      setEditProductMode({ [itemId]: field });
    } else if (type === "primary") {
      setEditPrimaryMode({ [itemId]: field });
    } else if (type === "secondary") {
      setEditSecondaryMode({ [itemId]: field });
    }
  };

  const handleBlur = async (
    itemId: number,
    field: string,
    value: any,
    type: "product" | "primary" | "secondary"
  ) => {
    try {
      await updateProduct(itemId, type, { [field]: value });

      const response = await getProducts(page, pageSize);
      setProductData(response.data.products);
    } catch (error) {
      console.error("Error updating product:", error);
    } finally {
      if (type === "product") {
        setEditProductMode({});
      } else if (type === "primary") {
        setEditPrimaryMode({});
      } else if (type === "secondary") {
        setEditSecondaryMode({});
      }
    }
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  return (
    <div className="h-full flex flex-col items-center justify-normal p-3 mt-3">
      <table className="min-w-full bg-white grow min-h-[80%]">
        <colgroup>
          <col span={1} style={{ width: "45%" }} />
          <col span={1} style={{ width: "10%" }} />
          <col span={1} style={{ width: "10%" }} />
          <col span={1} style={{ width: "5%" }} />
          <col span={1} style={{ width: "5%" }} />
          <col span={1} style={{ width: "5%" }} />
          <col span={1} style={{ width: "15%" }} />
          <col span={1} style={{ width: "25%" }} />
          <col span={1} style={{ width: "5%" }} />
        </colgroup>
        <thead>
          <tr>
            <th className="py-2 px-4 border-b  bg-gray-100">Product Name</th>
            <th className="py-2 px-4 border-b">Variant</th>
            <th className="py-2 px-4 border-b">Price</th>
            <th className="py-2 px-4 border-b">Discount</th>
            <th className="py-2 px-4 border-b">Inventory</th>
            <th className="py-2 px-4 border-b">Active</th>
            <th className="py-2 px-4 border-b">Lead Time</th>
            <th className="py-2 px-4 border-b">Description</th>
            <th className="py-2 px-4 border-b">Category</th>
          </tr>
        </thead>
        <tbody>
          {productData.map((product) => (
            <React.Fragment key={product.id}>
              <tr>
                <td
                  className="py-2 px-4 border-b cursor-pointer bg-gray-100"
                  onClick={() => toggleExpand(product.id)}
                >
                  <div className="flex gap-3 items-center">
                    {expanded[product.id] ? (
                      <DownOutlined style={{ fontSize: "16px" }} />
                    ) : (
                      <RightOutlined style={{ fontSize: "16px" }} />
                    )}
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-12 h-12 object-cover rounded-full"
                    />
                    {product.title}
                  </div>
                </td>
                <td className="py-2 px-4 border-b">
                  <div className="flex gap-2 justify-center">
                    {product.primaryVariants.map((pv: any) => (
                      <div
                        key={pv.name}
                        className="w-2 h-2 rounded-full"
                        style={{
                          backgroundColor: isColor(pv.name)
                            ? pv.name.toLowerCase()
                            : "white",
                        }}
                      />
                    ))}
                  </div>
                </td>
                <td className="py-2 px-4 border-b">
                  {editProductMode[product.id] === "price" ? (
                    <InputNumber
                      value={product.price}
                      onChange={(value) =>
                        handleInputChange(product.id, "price", value, "product")
                      }
                      onBlur={(e) =>
                        handleBlur(
                          product.id,
                          "price",
                          Number(e.target.value),
                          "product"
                        )
                      }
                      className="w-full"
                      autoFocus
                    />
                  ) : (
                    <Text
                      onDoubleClick={() =>
                        handleDoubleClick(product.id, "price", "product")
                      }
                    >
                      {product.price}
                    </Text>
                  )}
                </td>
                <td className="py-2 px-4 border-b">
                  {editProductMode[product.id] === "discountPercentage" ? (
                    <InputNumber
                      value={product.discountPercentage}
                      onChange={(value) =>
                        handleInputChange(
                          product.id,
                          "discountPercentage",
                          value,
                          "product"
                        )
                      }
                      onBlur={(e) =>
                        handleBlur(
                          product.id,
                          "discountPercentage",
                          Number(e.target.value),
                          "product"
                        )
                      }
                      className="w-full"
                      autoFocus
                    />
                  ) : (
                    <Text
                      onDoubleClick={() =>
                        handleDoubleClick(
                          product.id,
                          "discountPercentage",
                          "product"
                        )
                      }
                    >
                      {product.discountPercentage}
                    </Text>
                  )}
                </td>
                <td className="py-2 px-4 border-b">
                  {editProductMode[product.id] === "inventory" ? (
                    <InputNumber
                      value={product.inventory}
                      onChange={(value) =>
                        handleInputChange(
                          product.id,
                          "inventory",
                          value,
                          "product"
                        )
                      }
                      onBlur={(e) =>
                        handleBlur(
                          product.id,
                          "inventory",
                          Number(e.target.value),
                          "product"
                        )
                      }
                      className="w-full"
                      autoFocus
                    />
                  ) : (
                    <Text
                      onDoubleClick={() =>
                        handleDoubleClick(product.id, "inventory", "product")
                      }
                    >
                      {product.inventory}
                    </Text>
                  )}
                </td>
                <td className="py-2 px-4 border-b">
                  <Switch
                    checked={product.active}
                    onChange={(checked) =>
                      handleBlur(product.id, "active", checked, "product")
                    }
                  />
                </td>
                <td className="py-2 px-4 border-b">
                  {editProductMode[product.id] === "leadTime" ? (
                    <Input
                      value={product.leadTime}
                      onChange={(e) =>
                        handleInputChange(
                          product.id,
                          "leadTime",
                          e.target.value,
                          "product"
                        )
                      }
                      onBlur={(e) =>
                        handleBlur(
                          product.id,
                          "leadTime",
                          e.target.value,
                          "product"
                        )
                      }
                      className="w-full"
                      autoFocus
                    />
                  ) : (
                    <Text
                      onDoubleClick={() =>
                        handleDoubleClick(product.id, "leadTime", "product")
                      }
                    >
                      {product.leadTime}
                    </Text>
                  )}
                </td>
                <td className="py-2 px-4 border-b text-start">
                  {editProductMode[product.id] === "description" ? (
                    <TextArea
                      value={product.description}
                      onChange={(e) =>
                        handleInputChange(
                          product.id,
                          "description",
                          e.target.value,
                          "product"
                        )
                      }
                      onBlur={(e) =>
                        handleBlur(
                          product.id,
                          "description",
                          e.target.value,
                          "product"
                        )
                      }
                      autoSize={{ minRows: 1, maxRows: 3 }}
                      autoFocus
                    />
                  ) : (
                    <Tooltip title={product.description}>
                      <Text
                        onDoubleClick={() =>
                          handleDoubleClick(
                            product.id,
                            "description",
                            "product"
                          )
                        }
                        className="line-clamp-3"
                      >
                        {product.description}
                      </Text>
                    </Tooltip>
                  )}
                </td>
                <td className="py-2 px-4 border-b">
                  {editProductMode[product.id] === "category" ? (
                    <Input
                      value={product.category}
                      onChange={(e) =>
                        handleInputChange(
                          product.id,
                          "category",
                          e.target.value,
                          "product"
                        )
                      }
                      onBlur={(e) =>
                        handleBlur(
                          product.id,
                          "category",
                          e.target.value,
                          "product"
                        )
                      }
                      className="w-full"
                      autoFocus
                    />
                  ) : (
                    <Text
                      onDoubleClick={() =>
                        handleDoubleClick(product.id, "category", "product")
                      }
                    >
                      {product.category}
                    </Text>
                  )}
                </td>
              </tr>

              {expanded[product.id] &&
                product.primaryVariants.map((pv: any) => (
                  <React.Fragment key={pv.id}>
                    <tr>
                      <td
                        className="py-2 px-4 border-b cursor-pointer bg-gray-100"
                        onClick={() => toggleSecondaryExpand(product.id, pv.id)}
                      >
                        <div className="ml-12 flex items-center gap-3">
                          {expandedSecondary[product.id]?.[pv.id] ? (
                            <DownOutlined style={{ fontSize: "16px" }} />
                          ) : (
                            <RightOutlined style={{ fontSize: "16px" }} />
                          )}
                          <img
                            src={product.image}
                            alt={product.title}
                            className="w-10 h-10 object-cover rounded-full"
                          />
                          <span>{pv.name}</span>
                        </div>
                      </td>
                      <td className="py-2 px-4 border-b">
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{
                            backgroundColor: isColor(pv.name)
                              ? pv.name.toLowerCase()
                              : "white",
                          }}
                        />
                      </td>
                      <td className="py-2 px-4 border-b">
                        {editPrimaryMode[pv.id] === "price" ? (
                          <InputNumber
                            value={pv.price}
                            onChange={(value) =>
                              handleInputChange(
                                pv.id,
                                "price",
                                value,
                                "primary"
                              )
                            }
                            onBlur={(e) =>
                              handleBlur(
                                pv.id,
                                "price",
                                Number(e.target.value),
                                "primary"
                              )
                            }
                            className="w-full"
                            autoFocus
                          />
                        ) : (
                          <Text
                            onDoubleClick={() =>
                              handleDoubleClick(pv.id, "price", "primary")
                            }
                          >
                            {pv.price}
                          </Text>
                        )}
                      </td>
                      <td className="py-2 px-4 border-b">
                        {editPrimaryMode[pv.id] === "discountPercentage" ? (
                          <InputNumber
                            value={pv.discountPercentage}
                            onChange={(value) =>
                              handleInputChange(
                                pv.id,
                                "discountPercentage",
                                value,
                                "primary"
                              )
                            }
                            onBlur={(e) =>
                              handleBlur(
                                pv.id,
                                "discountPercentage",
                                Number(e.target.value),
                                "primary"
                              )
                            }
                            className="w-full"
                            autoFocus
                          />
                        ) : (
                          <Text
                            onDoubleClick={() =>
                              handleDoubleClick(
                                pv.id,
                                "discountPercentage",
                                "primary"
                              )
                            }
                          >
                            {pv.discountPercentage}
                          </Text>
                        )}
                      </td>
                      <td className="py-2 px-4 border-b">
                        {editPrimaryMode[pv.id] === "inventory" ? (
                          <InputNumber
                            value={pv.inventory}
                            onChange={(value) =>
                              handleInputChange(
                                pv.id,
                                "inventory",
                                value,
                                "primary"
                              )
                            }
                            onBlur={(e) =>
                              handleBlur(
                                pv.id,
                                "inventory",
                                Number(e.target.value),
                                "primary"
                              )
                            }
                            className="w-full"
                            autoFocus
                          />
                        ) : (
                          <Text
                            onDoubleClick={() =>
                              handleDoubleClick(pv.id, "inventory", "primary")
                            }
                          >
                            {pv.inventory}
                          </Text>
                        )}
                      </td>
                      <td className="py-2 px-4 border-b">-</td>
                      <td className="py-2 px-4 border-b">-</td>
                      <td className="py-2 px-4 border-b">-</td>
                      <td className="py-2 px-4 border-b">-</td>
                    </tr>

                    {expandedSecondary[product.id]?.[pv.id] &&
                      pv.secondaryVariants.map((sv: any, svIndex: number) => (
                        <tr key={svIndex}>
                          <td className="py-2 px-4 border-b pl-16 bg-gray-100">
                            <span className="ml-20">
                              {SIZE_ABBREVIATIONS[sv.name] || sv.name}
                            </span>
                          </td>
                          <td className="py-2 px-4 border-b">-</td>
                          <td className="py-2 px-4 border-b">
                            {editSecondaryMode[sv.id] === "price" ? (
                              <InputNumber
                                value={sv.price}
                                onChange={(value) =>
                                  handleInputChange(
                                    sv.id,
                                    "price",
                                    value,
                                    "secondary"
                                  )
                                }
                                onBlur={(e) =>
                                  handleBlur(
                                    sv.id,
                                    "price",
                                    Number(e.target.value),
                                    "secondary"
                                  )
                                }
                                className="w-full"
                                autoFocus
                              />
                            ) : (
                              <Text
                                onDoubleClick={() =>
                                  handleDoubleClick(sv.id, "price", "secondary")
                                }
                              >
                                {sv.price}
                              </Text>
                            )}
                          </td>
                          <td className="py-2 px-4 border-b">
                            {editSecondaryMode[sv.id] ===
                            "discountPercentage" ? (
                              <InputNumber
                                value={sv.discountPercentage}
                                onChange={(value) =>
                                  handleInputChange(
                                    sv.id,
                                    "discountPercentage",
                                    value,
                                    "secondary"
                                  )
                                }
                                onBlur={(e) =>
                                  handleBlur(
                                    sv.id,
                                    "discountPercentage",
                                    Number(e.target.value),
                                    "secondary"
                                  )
                                }
                                className="w-full"
                                autoFocus
                              />
                            ) : (
                              <Text
                                onDoubleClick={() =>
                                  handleDoubleClick(
                                    sv.id,
                                    "discountPercentage",
                                    "secondary"
                                  )
                                }
                              >
                                {sv.discountPercentage}
                              </Text>
                            )}
                          </td>
                          <td className="py-2 px-4 border-b">
                            {editSecondaryMode[sv.id] === "inventory" ? (
                              <InputNumber
                                value={sv.inventory}
                                onChange={(value) =>
                                  handleInputChange(
                                    sv.id,
                                    "inventory",
                                    value,
                                    "secondary"
                                  )
                                }
                                onBlur={(e) =>
                                  handleBlur(
                                    sv.id,
                                    "inventory",
                                    Number(e.target.value),
                                    "secondary"
                                  )
                                }
                                className="w-full"
                                autoFocus
                              />
                            ) : (
                              <Text
                                onDoubleClick={() =>
                                  handleDoubleClick(
                                    sv.id,
                                    "inventory",
                                    "secondary"
                                  )
                                }
                              >
                                {sv.inventory}
                              </Text>
                            )}
                          </td>
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
      <Pagination
        className="mt-4"
        current={page}
        pageSize={pageSize}
        total={totalProducts}
        onChange={handlePageChange}
      />
    </div>
  );
}
