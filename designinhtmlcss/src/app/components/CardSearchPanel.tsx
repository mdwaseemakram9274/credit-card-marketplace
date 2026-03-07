import React, { useState, useEffect } from 'react';
import { useSearch, fetchFilterOptions } from '../../../../lib/hooks/useSearch';
import { PaginationControls } from './PaginationControls';
import styles from './CardSearchPanel.module.css';
import {
  Search,
  Filter,
  X,
  ChevronDown,
  Zap,
  Gift,
  CreditCard,
  Globe,
  Building2,
  Tags,
} from 'lucide-react';

interface FilterOptions {
  networks: string[];
  banks: string[];
  categories: string[];
  benefits: string[];
  features: string[];
}

export const CardSearchPanel: React.FC = () => {
  const { results, total, loading, error, filters, pagination, updateFilters, search, goToPage, resetFilters } =
    useSearch();
  const [showFilters, setShowFilters] = useState(false);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    networks: [],
    banks: [],
    categories: [],
    benefits: [],
    features: [],
  });
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  // Fetch available filter options
  useEffect(() => {
    fetchFilterOptions().then(setFilterOptions);
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    updateFilters({ q: query });
  };

  const handleNetworkChange = (network: string) => {
    updateFilters({
      network: filters.network === network ? undefined : network,
    });
  };

  const handleBankChange = (bank: string) => {
    updateFilters({
      bank: filters.bank === bank ? undefined : bank,
    });
  };

  const handleCategoryToggle = (category: string) => {
    const current = filters.categories || [];
    const updated = current.includes(category)
      ? current.filter((c) => c !== category)
      : [...current, category];
    updateFilters({
      categories: updated.length > 0 ? updated : undefined,
    });
  };

  const handleBenefitToggle = (benefit: string) => {
    const current = filters.benefits || [];
    const updated = current.includes(benefit)
      ? current.filter((b) => b !== benefit)
      : [...current, benefit];
    updateFilters({
      benefits: updated.length > 0 ? updated : undefined,
    });
  };

  const handleSortChange = (sort: string) => {
    updateFilters({
      sortBy: sort as any,
    });
  };

  const handleFreeCardToggle = () => {
    updateFilters({
      minAnnualFee: filters.minAnnualFee === 0 ? undefined : 0,
    });
  };

  const handleWelcomeBonusToggle = () => {
    updateFilters({
      hasWelcomeBonus: filters.hasWelcomeBonus ? undefined : true,
    });
  };

  const handleCashbackToggle = () => {
    updateFilters({
      hasCashback: filters.hasCashback ? undefined : true,
    });
  };

  const handleLoungeToggle = () => {
    updateFilters({
      hasLounge: filters.hasLounge ? undefined : true,
    });
  };

  const activeFilterCount = [
    filters.q ? 1 : 0,
    filters.network ? 1 : 0,
    filters.bank ? 1 : 0,
    filters.categories?.length || 0,
    filters.benefits?.length || 0,
    filters.minAnnualFee === 0 ? 1 : 0,
    filters.hasWelcomeBonus ? 1 : 0,
    filters.hasCashback ? 1 : 0,
    filters.hasLounge ? 1 : 0,
  ].reduce((a, b) => a + b, 0);

  const toggleFilter = (section: string) => {
    setExpanded((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <div className={styles.container}>
      {/* Header with Search */}
      <div className={styles.header}>
        <div className={styles.searchBox}>
          <Search className={styles.searchIcon} size={20} />
          <input
            type="text"
            placeholder="Search credit cards..."
            value={filters.q || ''}
            onChange={handleSearchChange}
            className={styles.searchInput}
          />
          {filters.q && (
            <button
              onClick={() => updateFilters({ q: undefined })}
              className={styles.clearBtn}
              aria-label="Clear search"
            >
              <X size={16} />
            </button>
          )}
        </div>

        <div className={styles.controls}>
          <select
            value={filters.sortBy || 'relevance'}
            onChange={(e) => handleSortChange(e.target.value)}
            className={styles.sortSelect}
          >
            <option value="relevance">Sort: Relevance</option>
            <option value="newest">Sort: Newest</option>
            <option value="name">Sort: Name (A-Z)</option>
            <option value="fee_asc">Sort: Fee (Low to High)</option>
            <option value="fee_desc">Sort: Fee (High to Low)</option>
          </select>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`${styles.filterBtn} ${showFilters ? styles.active : ''} ${
              activeFilterCount > 0 ? styles.hasFilters : ''
            }`}
          >
            <Filter size={18} />
            Filters
            {activeFilterCount > 0 && <span className={styles.badge}>{activeFilterCount}</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className={styles.content}>
        {/* Sidebar Filters */}
        {showFilters && (
          <aside className={styles.sidebar}>
            <div className={styles.sidebarHeader}>
              <h3>Filters</h3>
              {activeFilterCount > 0 && (
                <button onClick={resetFilters} className={styles.resetBtn}>
                  Reset All
                </button>
              )}
            </div>

            {/* Free Card Filter */}
            <div className={styles.filterSection}>
              <button
                onClick={() => toggleFilter('fees')}
                className={styles.filterSectionTitle}
              >
                <span>Annual Fee</span>
                <ChevronDown
                  size={16}
                  style={{
                    transform: expanded['fees'] ? 'rotate(180deg)' : '',
                    transition: 'transform 0.2s',
                  }}
                />
              </button>
              {expanded['fees'] && (
                <div className={styles.filterOptions}>
                  <label className={styles.checkbox}>
                    <input
                      type="checkbox"
                      checked={filters.minAnnualFee === 0}
                      onChange={handleFreeCardToggle}
                    />
                    <span>Free Annual Fee</span>
                  </label>
                </div>
              )}
            </div>

            {/* Quick Filters */}
            <div className={styles.filterSection}>
              <button
                onClick={() => toggleFilter('benefits')}
                className={styles.filterSectionTitle}
              >
                <span>Benefits</span>
                <ChevronDown
                  size={16}
                  style={{
                    transform: expanded['benefits'] ? 'rotate(180deg)' : '',
                    transition: 'transform 0.2s',
                  }}
                />
              </button>
              {expanded['benefits'] && (
                <div className={styles.filterOptions}>
                  <label className={styles.checkbox}>
                    <input
                      type="checkbox"
                      checked={filters.hasWelcomeBonus || false}
                      onChange={handleWelcomeBonusToggle}
                    />
                    <span>Welcome Bonus</span>
                  </label>
                  <label className={styles.checkbox}>
                    <input
                      type="checkbox"
                      checked={filters.hasCashback || false}
                      onChange={handleCashbackToggle}
                    />
                    <span>Cashback</span>
                  </label>
                  <label className={styles.checkbox}>
                    <input
                      type="checkbox"
                      checked={filters.hasLounge || false}
                      onChange={handleLoungeToggle}
                    />
                    <span>Lounge Access</span>
                  </label>
                </div>
              )}
            </div>

            {/* Network Filter */}
            {filterOptions.networks.length > 0 && (
              <div className={styles.filterSection}>
                <button
                  onClick={() => toggleFilter('networks')}
                  className={styles.filterSectionTitle}
                >
                  <Globe size={16} />
                  <span>Card Network</span>
                  <ChevronDown
                    size={16}
                    style={{
                      transform: expanded['networks'] ? 'rotate(180deg)' : '',
                      transition: 'transform 0.2s',
                    }}
                  />
                </button>
                {expanded['networks'] && (
                  <div className={styles.filterOptions}>
                    {filterOptions.networks.map((network) => (
                      <label key={network} className={styles.radio}>
                        <input
                          type="radio"
                          name="network"
                          checked={filters.network === network}
                          onChange={() => handleNetworkChange(network)}
                        />
                        <span>{network}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Bank Filter */}
            {filterOptions.banks.length > 0 && (
              <div className={styles.filterSection}>
                <button
                  onClick={() => toggleFilter('banks')}
                  className={styles.filterSectionTitle}
                >
                  <Building2 size={16} />
                  <span>Bank</span>
                  <ChevronDown
                    size={16}
                    style={{
                      transform: expanded['banks'] ? 'rotate(180deg)' : '',
                      transition: 'transform 0.2s',
                    }}
                  />
                </button>
                {expanded['banks'] && (
                  <div className={styles.filterOptions}>
                    {filterOptions.banks.map((bank) => (
                      <label key={bank} className={styles.radio}>
                        <input
                          type="radio"
                          name="bank"
                          checked={filters.bank === bank}
                          onChange={() => handleBankChange(bank)}
                        />
                        <span>{bank}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Category Filter */}
            {filterOptions.categories.length > 0 && (
              <div className={styles.filterSection}>
                <button
                  onClick={() => toggleFilter('categories')}
                  className={styles.filterSectionTitle}
                >
                  <Tags size={16} />
                  <span>Category</span>
                  <ChevronDown
                    size={16}
                    style={{
                      transform: expanded['categories'] ? 'rotate(180deg)' : '',
                      transition: 'transform 0.2s',
                    }}
                  />
                </button>
                {expanded['categories'] && (
                  <div className={styles.filterOptions}>
                    {filterOptions.categories.slice(0, 8).map((category) => (
                      <label key={category} className={styles.checkbox}>
                        <input
                          type="checkbox"
                          checked={(filters.categories || []).includes(category)}
                          onChange={() => handleCategoryToggle(category)}
                        />
                        <span>{category}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            )}
          </aside>
        )}

        {/* Results */}
        <main className={styles.results}>
          {loading && (
            <div className={styles.loading}>
              <div className={styles.spinner}></div>
              <p>Searching cards...</p>
            </div>
          )}

          {error && (
            <div className={styles.error}>
              <p>⚠️ {error}</p>
            </div>
          )}

          {!loading && !error && results.length === 0 && filters.q && (
            <div className={styles.empty}>
              <CreditCard size={48} />
              <p>No cards found matching your search</p>
            </div>
          )}

          {!loading && !error && results.length === 0 && !filters.q && (
            <div className={styles.empty}>
              <Search size={48} />
              <p>Start searching to find your perfect credit card</p>
            </div>
          )}

          {results.length > 0 && (
            <>
              <div className={styles.resultHeader}>
                <p>
                  Found <strong>{total}</strong> card{total !== 1 ? 's' : ''}
                  {filters.q && ` matching "${filters.q}"`}
                </p>
              </div>

              <div className={styles.resultGrid}>
                {results.map((card) => (
                  <div key={card.id} className={styles.resultCard}>
                    {card.card_image_url && (
                      <img
                        src={card.card_image_url}
                        alt={card.card_name}
                        className={styles.cardImage}
                      />
                    )}
                    <div className={styles.cardContent}>
                      <h4>{card.card_name}</h4>
                      {card.banks && <p className={styles.bank}>{card.banks.name}</p>}

                      {card.network && <span className={styles.network}>{card.network}</span>}

                      {card.annual_fee && (
                        <p className={styles.fee}>
                          {card.annual_fee === 'Free' || card.annual_fee === '₹0'
                            ? '✓ Free Annual Fee'
                            : `Annual Fee: ${card.annual_fee}`}
                        </p>
                      )}

                      {card.welcome_bonus && (
                        <div className={styles.badge_group}>
                          <Gift size={14} />
                          <span>{card.welcome_bonus}</span>
                        </div>
                      )}

                      {card.benefits && card.benefits.length > 0 && (
                        <div className={styles.benefits}>
                          {card.benefits.slice(0, 3).map((benefit, idx) => (
                            <span key={idx} className={styles.benefit}>
                              {benefit}
                            </span>
                          ))}
                          {card.benefits.length > 3 && (
                            <span className={styles.benefitMore}>
                              +{card.benefits.length - 3} more
                            </span>
                          )}
                        </div>
                      )}

                      <div className={styles.actions}>
                        <a href={`/card/${card.id}`} className={styles.viewBtn}>
                          View Details →
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination Controls */}
              {pagination.totalPages > 1 && (
                <PaginationControls
                  currentPage={pagination.currentPage}
                  totalPages={pagination.totalPages}
                  pageSize={pagination.pageSize}
                  totalItems={pagination.totalItems}
                  onPageChange={goToPage}
                  showSummary={true}
                />
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};
