import React, { useState, useEffect, useMemo } from 'react';
import { AppProvider, useAppContext } from './context/AppContext';
import { PRODUCTS, FAQ_ITEMS } from './data/mockData';

import Accordion from './components/Accordion/Accordion';
import Pagination from './components/Pagination/Pagination';
import ProgressBar from './components/ProgressBar/ProgressBar';
import Tabs from './components/Tabs/Tabs';
import DropdownMenu from './components/DropdownMenu/DropdownMenu';
import Toast from './components/Toast/Toast';

import './App.css';

const ITEMS_PER_PAGE = 3;

function MainContent() {
  const {
    selectedProduct,
    selectProduct,
    toast,
    showToast,
    closeToast,
  } = useAppContext();

  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [currentPage, setCurrentPage] = useState(1);

  const [isLoadingPage, setIsLoadingPage] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [targetPage, setTargetPage] = useState(null);

  const filteredProducts = useMemo(() => {
    if (selectedCategory === 'Todos') return PRODUCTS;
    return PRODUCTS.filter((product) => product.category === selectedCategory);
  }, [selectedCategory]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredProducts.length / ITEMS_PER_PAGE)
  );

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  // Carregamento da página com duração aproximada de 2,5 segundos
  useEffect(() => {
    if (!isLoadingPage || targetPage === null) {
      return undefined;
    }

    let finishTimeoutId = null;

    const intervalId = setInterval(() => {
      setLoadingProgress((prev) => {
        const next = Math.min(100, prev + 10);
        if (next >= 100) {
          clearInterval(intervalId);
          finishTimeoutId = setTimeout(() => {
            const nextPageStart = (targetPage - 1) * ITEMS_PER_PAGE;
            const firstOfNextPage = filteredProducts[nextPageStart];
            if (firstOfNextPage) {
              selectProduct(firstOfNextPage);
            }
            setCurrentPage(targetPage);
            setIsLoadingPage(false);
            setTargetPage(null);
            showToast(`Página ${targetPage} carregada com sucesso.`, 'success');
          }, 200);
        }
        return next;
      });
    }, 230);

    return () => {
      clearInterval(intervalId);
      if (finishTimeoutId) {
        clearTimeout(finishTimeoutId);
      }
    };
  }, [isLoadingPage, targetPage, filteredProducts, selectProduct, showToast]);

  const handleCategorySelect = (category) => {
    if (category === selectedCategory) {
      showToast(`A categoria "${category}" já está selecionada.`, 'error');
      return;
    }

    const nextList =
      category === 'Todos'
        ? PRODUCTS
        : PRODUCTS.filter((product) => product.category === category);

    setIsLoadingPage(false);
    setTargetPage(null);
    setSelectedCategory(category);
    setCurrentPage(1);
    if (nextList[0]) {
      selectProduct(nextList[0]);
    }
    showToast(`Filtro aplicado: ${category}.`, 'info');
  };

  const filterOptions = [
    {
      id: 'todos',
      label: 'Todos',
      onSelect: () => handleCategorySelect('Todos'),
    },
    {
      id: 'eletronicos',
      label: 'Eletrônicos',
      onSelect: () => handleCategorySelect('Eletrônicos'),
    },
    {
      id: 'iluminacao',
      label: 'Iluminação',
      onSelect: () => handleCategorySelect('Iluminação'),
    },
    {
      id: 'acessorios',
      label: 'Acessórios',
      onSelect: () => handleCategorySelect('Acessórios'),
    },
  ];

  const handlePageChange = (nextPage) => {
    if (nextPage === currentPage || isLoadingPage) {
      return;
    }
    setLoadingProgress(0);
    setTargetPage(nextPage);
    setIsLoadingPage(true);
  };

  const handleProductClick = (product) => {
    selectProduct(product);
    showToast(`Exibindo informações de: ${product.name}`, 'info');
  };

  // Abas dinâmicas conforme o produto selecionado
  const productTabs = useMemo(
    () => [
      {
        id: 'descricao',
        title: 'Descrição',
        content: selectedProduct.description,
      },
      {
        id: 'especificacoes',
        title: 'Especificações',
        content: selectedProduct.specs,
      },
      {
        id: 'envio',
        title: 'Envio e Prazo',
        content: selectedProduct.shipping,
      },
    ],
    [selectedProduct]
  );

  return (
    <div className="app-layout">
      <header className="app-header">
        <div className="container">
          <h1>Catálogo Online</h1>
        </div>
      </header>

      <main className="container main-grid">
        {/* Menu Suspenso + Barra de Progresso ao paginar + Paginação */}
        <section className="section" aria-labelledby="sec-produtos">
          <div className="section-header">
            <h2 id="sec-produtos">Produtos</h2>
            <DropdownMenu
              label={`Categoria: ${selectedCategory}`}
              options={filterOptions}
            />
          </div>

          {isLoadingPage ? (
            <div className="loading-area" aria-live="polite">
              <ProgressBar
                value={loadingProgress}
                label={`Carregando página ${targetPage}...`}
              />
            </div>
          ) : (
            <div className="cards-grid">
              {paginatedProducts.map((product) => {
                const isSelected = selectedProduct.id === product.id;
                return (
                  <article
                    key={product.id}
                    className={`card ${isSelected ? 'is-selected' : ''}`}
                  >
                    <button
                      type="button"
                      className="card-trigger"
                      aria-pressed={isSelected}
                      onClick={() => handleProductClick(product)}
                    >
                      <span className="card-category">{product.category}</span>
                      <h3 className="card-title">{product.name}</h3>
                      <p className="card-desc">{product.summary}</p>
                    </button>
                  </article>
                );
              })}
            </div>
          )}

          <Pagination
            totalPages={totalPages}
            currentPage={targetPage || currentPage}
            disabled={isLoadingPage}
            onPageChange={handlePageChange}
          />
        </section>

        {/* Abas dinâmicas do produto selecionado */}
        <section className="section" aria-labelledby="sec-detalhes">
          <div className="details-header">
            <h2 id="sec-detalhes">Informações — {selectedProduct.name}</h2>
          </div>
          <Tabs tabs={productTabs} />
        </section>

        {/* Acordeão */}
        <section className="section" aria-labelledby="sec-faq">
          <h2 id="sec-faq">Perguntas Frequentes</h2>
          <Accordion items={FAQ_ITEMS} />
        </section>
      </main>

      {toast && (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={closeToast}
        />
      )}

      <footer className="app-footer">
        <div className="container">
          <p>© 2026 Catálogo Online</p>
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}

export default App;
