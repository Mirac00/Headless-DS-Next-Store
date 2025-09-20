'use client';

// Import React hooks
import { useEffect, useState } from "react";
// Import Next.js hooks dla query params i nawigacji
import { useSearchParams, useRouter } from "next/navigation";
// Import API functions
import { getProducts } from "@/services/api";
// Import context hook
import { myStoreHook } from "@/context/MyStoreContext";
// Import types
import { Product } from "@/types";

export default function ProductsClient() {
  // Access context functions
  const { addProductsToCart, setPageLoading, renderProductPrice } = myStoreHook();
  // State dla produktów, strony i totals
  const [products, setProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  
  // Router i search params
  const router = useRouter();
  const searchParams = useSearchParams();
  const perPage = 20; // Stała liczba produktów na stronę

  // Fetch products dla bieżącej strony
  const fetchProducts = async (page: number) => {
    setPageLoading(true);
    try {
      const response = await getProducts(page, perPage);
      if (response) {
        setProducts(response.products);
        setTotalPages(response.totalPages);
        setTotalProducts(response.total);
      }
    } catch (error) {
      console.error('Error fetching products in ProductsClient:', error);
    } finally {
      setPageLoading(false);
    }
  };

  // Efekt do ładowania produktów przy zmianie strony w URL
  useEffect(() => {
    // Czytaj stronę z URL query (domyślnie 1)
    const pageFromQuery = parseInt(searchParams.get('page') || '1', 10);
    // Upewnij się, że page jest >= 1
    if (pageFromQuery < 1) {
      router.push('/products?page=1');
      return;
    }
    setCurrentPage(pageFromQuery);
    fetchProducts(pageFromQuery);
  }, [searchParams]);

  // Navigate to single product page
  const handleSingleProductDetailsRedirection = (productId: number) => {
    router.push(`/product/${productId}`);
  };

  // Nawigacja do strony (aktualizuje URL)
  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return; // Zapobiega niepoprawnym stronom
    setCurrentPage(page);
    router.push(`/products?page=${page}`);
  };

  // Generuj paginację
  const renderPagination = () => {
    const pages = [];
    const maxVisiblePages = 5; // Pokazuj max 5 stron naraz
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    if (totalPages <= 1) return null;

    // Przycisk "Poprzednia"
    pages.push(
      <button
        key="prev"
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage === 1}
        className="btn btn-secondary me-2"
      >
        Poprzednia
      </button>
    );

    // Numery stron
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => goToPage(i)}
          className={`btn ${currentPage === i ? 'btn-primary' : 'btn-outline-primary'} me-2`}
        >
          {i}
        </button>
      );
    }

    // Przycisk "Następna"
    pages.push(
      <button
        key="next"
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="btn btn-secondary"
      >
        Następna
      </button>
    );

    return (
      <div className="d-flex justify-content-center mt-4">
        <p className="me-3 mt-2">Strona {currentPage} z {totalPages} (Produkty: {totalProducts})</p>
        {pages}
      </div>
    );
  };

  return (
    <div className="container">
      <h1 className="my-4">Products</h1>
      <div className="row">
        {products.map((singleProduct: Product) => (
          <div
            key={singleProduct.id}
            className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4"
          >
            <div className="card product-card">
              <img
                className="card-img-top"
                src={singleProduct?.images?.[0]?.src}
                alt={singleProduct.name}
              />
              <div className="card-body">
                <h5
                  className="card-title"
                  style={{ cursor: "pointer" }}
                  onClick={() => handleSingleProductDetailsRedirection(singleProduct.id)}
                >
                  {singleProduct.name}
                </h5>
                <p className="card-text">{renderProductPrice(singleProduct)}</p>
                <p
                  className="card-text"
                  dangerouslySetInnerHTML={{ __html: singleProduct?.description }}
                ></p>
                <p className="card-text">
                  Category:{" "}
                  {singleProduct?.categories?.map((category) => category.name).join(", ")}
                </p>
                <button
                  className="btn btn-primary"
                  onClick={() => addProductsToCart(singleProduct)}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {renderPagination()}
    </div>
  );
}