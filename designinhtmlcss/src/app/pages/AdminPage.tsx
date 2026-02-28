import { useState } from 'react';
import { 
  CreditCard, 
  LayoutDashboard, 
  Plus, 
  Search, 
  Bell, 
  ChevronDown,
  Edit2,
  Eye,
  Trash2,
  RotateCcw,
  Save,
  ArrowLeft,
  Home,
  Building2,
  FileText,
  Upload,
  X
} from 'lucide-react';
import { creditCardsData } from '../data/creditCardsData';
import { Link } from 'react-router';
import { CreditCard as CreditCardPreview } from '../components/CreditCardSection';

type TabType = 'dashboard' | 'add-card' | 'banks';

// Extended card data with bank and status
const extendedCardsData = creditCardsData.map((card, index) => ({
  ...card,
  bank: card.title.split(' ')[0], // Extract bank name from title
  cardName: card.title,
  joiningFeeDisplay: card.joiningFee,
  annualFeeDisplay: card.renewalFee,
  cardType: card.categories[0] || 'General',
  status: index % 3 === 0 ? 'Draft' : index % 2 === 0 ? 'Enabled' : 'Disabled',
}));

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterBank, setFilterBank] = useState('All Banks');
  const [filterFee, setFilterFee] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All Status');
  const [editingCard, setEditingCard] = useState<typeof extendedCardsData[0] | null>(null);
  
  // Card Types and Networks state
  const [cardTypes, setCardTypes] = useState<string[]>(['Travel', 'Shopping', 'Dining', 'Cashback', 'Rewards', 'Fuel', 'Business']);
  const [cardNetworks, setCardNetworks] = useState<string[]>(['Visa', 'Mastercard', 'RuPay', 'American Express']);

  // Get unique banks for filter
  const uniqueBanks = ['All Banks', ...Array.from(new Set(extendedCardsData.map(card => card.bank)))];

  // Filter cards based on search and filters
  const filteredCards = extendedCardsData.filter(card => {
    const matchesSearch = card.cardName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          card.bank.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBank = filterBank === 'All Banks' || card.bank === filterBank;
    const matchesFee = filterFee === 'All' || (filterFee === 'Free' ? card.joiningFeeDisplay === 'Free' : card.joiningFeeDisplay !== 'Free');
    const matchesStatus = filterStatus === 'All Status' || card.status === filterStatus;
    return matchesSearch && matchesBank && matchesFee && matchesStatus;
  });

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-48 bg-blue-600 text-white flex flex-col">
        {/* Logo */}
        <div className="p-4 border-b border-blue-500">
          <div className="flex items-center gap-2">
            <div className="bg-white p-1.5 rounded">
              <CreditCard className="w-5 h-5 text-blue-600" />
            </div>
            <span className="font-bold text-base">Card Admin</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'dashboard'
                ? 'bg-blue-700 text-white'
                : 'text-blue-100 hover:bg-blue-700 hover:text-white'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('add-card')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'add-card'
                ? 'bg-blue-700 text-white'
                : 'text-blue-100 hover:bg-blue-700 hover:text-white'
            }`}
          >
            <Plus className="w-4 h-4" />
            Add / Edit Card
          </button>
          <button
            onClick={() => setActiveTab('banks')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'banks'
                ? 'bg-blue-700 text-white'
                : 'text-blue-100 hover:bg-blue-700 hover:text-white'
            }`}
          >
            <Building2 className="w-4 h-4" />
            Banks
          </button>
          
          {/* Back to Website Link */}
          <Link
            to="/"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-blue-100 hover:bg-blue-700 hover:text-white transition-colors mt-4 border-t border-blue-500 pt-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Website
          </Link>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-blue-500">
          <div className="text-xs">
            <div className="font-semibold">Admin Workspace</div>
            <div className="text-blue-200 mt-0.5">Credit Card CRM Panel</div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search cards, banks, fees..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Bell className="w-5 h-5 text-gray-600" />
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
              <span>Admin (waseem)</span>
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-auto p-6">
          {activeTab === 'dashboard' ? (
            <DashboardContent 
              filteredCards={filteredCards}
              filterBank={filterBank}
              setFilterBank={setFilterBank}
              filterFee={filterFee}
              setFilterFee={setFilterFee}
              uniqueBanks={uniqueBanks}
              filterStatus={filterStatus}
              setFilterStatus={setFilterStatus}
              setEditingCard={setEditingCard}
              setActiveTab={setActiveTab}
            />
          ) : activeTab === 'banks' ? (
            <BanksManagementContent 
              cardTypes={cardTypes}
              setCardTypes={setCardTypes}
              cardNetworks={cardNetworks}
              setCardNetworks={setCardNetworks}
            />
          ) : (
            <AddCardContent 
              editingCard={editingCard} 
              setEditingCard={setEditingCard}
              cardTypes={cardTypes}
              cardNetworks={cardNetworks}
            />
          )}
        </main>
      </div>
    </div>
  );
}

function DashboardContent({ 
  filteredCards, 
  filterBank, 
  setFilterBank, 
  filterFee, 
  setFilterFee,
  uniqueBanks,
  filterStatus,
  setFilterStatus,
  setEditingCard,
  setActiveTab
}: {
  filteredCards: typeof extendedCardsData;
  filterBank: string;
  setFilterBank: (value: string) => void;
  filterFee: string;
  setFilterFee: (value: string) => void;
  uniqueBanks: string[];
  filterStatus: string;
  setFilterStatus: (value: string) => void;
  setEditingCard: (value: typeof extendedCardsData[0] | null) => void;
  setActiveTab: (value: TabType) => void;
}) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <LayoutDashboard className="w-5 h-5 text-blue-600" />
          <h1 className="text-xl font-bold text-gray-900">Dashboard - Cards List</h1>
        </div>
        <div className="text-sm text-gray-500">Stored in Supabase</div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Bank</label>
          <select
            value={filterBank}
            onChange={(e) => setFilterBank(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {uniqueBanks.map(bank => (
              <option key={bank} value={bank}>{bank}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Joining Fee</label>
          <select
            value={filterFee}
            onChange={(e) => setFilterFee(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">All</option>
            <option value="Free">Free</option>
            <option value="Paid">Paid</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Status</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="All Status">All Status</option>
            <option value="Enabled">Enabled</option>
            <option value="Disabled">Disabled</option>
            <option value="Draft">Draft</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Image</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Bank</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Card Name</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Joining Fee</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Annual Fee</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Card Type</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredCards.map((card) => (
                <tr key={card.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-4">
                    <img 
                      src={card.image} 
                      alt={card.cardName}
                      className="w-16 h-10 object-cover rounded border border-gray-200"
                    />
                  </td>
                  <td className="px-4 py-4 text-sm font-medium text-gray-900">{card.bank}</td>
                  <td className="px-4 py-4 text-sm text-gray-900">{card.cardName}</td>
                  <td className="px-4 py-4 text-sm text-gray-700">{card.joiningFeeDisplay}</td>
                  <td className="px-4 py-4 text-sm text-gray-700">{card.annualFeeDisplay}</td>
                  <td className="px-4 py-4 text-sm text-gray-700">{card.cardType}</td>
                  <td className="px-4 py-4">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${
                      card.status === 'Enabled' 
                        ? 'bg-green-100 text-green-800' 
                        : card.status === 'Disabled'
                          ? 'bg-gray-100 text-gray-800'
                          : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {card.status}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => {
                          setEditingCard(card);
                          setActiveTab('add-card');
                        }}
                        className="p-2 hover:bg-blue-50 rounded-lg transition-colors group"
                        title="Edit card"
                      >
                        <Edit2 className="w-4 h-4 text-blue-600" />
                      </button>
                      <button className="p-2 hover:bg-yellow-50 rounded-lg transition-colors group">
                        <Eye className="w-4 h-4 text-yellow-600" />
                      </button>
                      <button className="p-2 hover:bg-red-50 rounded-lg transition-colors group">
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Results count */}
      <div className="text-sm text-gray-600">
        Showing {filteredCards.length} of {extendedCardsData.length} cards
      </div>
    </div>
  );
}

function AddCardContent({ 
  editingCard, 
  setEditingCard,
  cardTypes,
  cardNetworks
}: { 
  editingCard: typeof extendedCardsData[0] | null; 
  setEditingCard: (value: typeof extendedCardsData[0] | null) => void;
  cardTypes: string[];
  cardNetworks: string[];
}) {
  const [openSection, setOpenSection] = useState<string | null>('basic');
  const [showPreview, setShowPreview] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    cardName: editingCard?.title || '',
    bank: editingCard?.bank || '',
    joiningFee: editingCard?.joiningFee || '',
    renewalFee: editingCard?.renewalFee || '',
    cardImage: editingCard?.image || 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400',
    benefits: editingCard?.benefits || ['Welcome bonus of reward points', 'Complimentary airport lounge access', 'Fuel surcharge waiver'],
    categories: editingCard?.categories || ['Travel']
  });

  const sections = [
    { id: 'basic', title: 'Basic Information' },
    { id: 'fees', title: 'Fees & Charges' },
    { id: 'rewards', title: 'Rewards & Benefits Details' },
    { id: 'product', title: 'Product Details & Description' },
    { id: 'perks', title: 'Special Perks & Offers' },
    { id: 'eligibility', title: 'Eligibility Criteria' },
    { id: 'pros', title: 'Pros & Cons' },
  ];

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Plus className="w-5 h-5 text-blue-600" />
        <h1 className="text-xl font-bold text-gray-900">Add / Edit Card</h1>
      </div>

      {/* Form Sections */}
      <div className="space-y-4">
        {sections.map((section) => (
          <div key={section.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <button
              onClick={() => setOpenSection(openSection === section.id ? null : section.id)}
              className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
            >
              <span className="text-sm font-medium text-gray-900">{section.title}</span>
              <ChevronDown 
                className={`w-5 h-5 text-gray-500 transition-transform ${
                  openSection === section.id ? 'rotate-180' : ''
                }`} 
              />
            </button>
            {openSection === section.id && (
              <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                <FormSection sectionId={section.id} cardTypes={cardTypes} cardNetworks={cardNetworks} formData={formData} setFormData={setFormData} />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3 flex-wrap">
        <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
          <Save className="w-4 h-4" />
          Save & Publish
        </button>
        <button className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-yellow-400 text-yellow-700 rounded-lg font-medium hover:bg-yellow-50 transition-colors">
          <FileText className="w-4 h-4" />
          Save as Draft
        </button>
        <button 
          onClick={() => setShowPreview(true)}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-colors"
        >
          <Eye className="w-4 h-4" />
          Preview Card
        </button>
        <button className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors">
          <RotateCcw className="w-4 h-4" />
          Reset
        </button>
      </div>
      
      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-50 rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Card Preview</h3>
                <p className="text-sm text-gray-500 mt-0.5">This is how your card will appear on the website</p>
              </div>
              <button 
                onClick={() => setShowPreview(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            <div className="p-6">
              <CreditCardPreview
                id="preview"
                image={formData.cardImage}
                title={formData.cardName || 'Card Name'}
                joiningFee={formData.joiningFee || 'Not specified'}
                renewalFee={formData.renewalFee || 'Not specified'}
                benefits={formData.benefits.length > 0 ? formData.benefits : ['No benefits added yet']}
                categories={formData.categories.length > 0 ? formData.categories : ['General']}
              />
            </div>
          </div>
        </div>
      )}
      
      {/* Info Message */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
        <div className="text-blue-600 mt-0.5">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-semibold text-blue-900 mb-1">💡 Draft Mode</h4>
          <p className="text-sm text-blue-700">
            Click <strong>"Save as Draft"</strong> to save your partially completed form and come back later. Drafts won't appear on the public website until you click <strong>"Save & Publish"</strong>.
          </p>
        </div>
      </div>
    </div>
  );
}

function FormSection({ sectionId, cardTypes, cardNetworks, formData, setFormData }: { 
  sectionId: string; 
  cardTypes: string[]; 
  cardNetworks: string[];
  formData: any;
  setFormData: (data: any) => void;
}) {
  if (sectionId === 'basic') {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Card Name *</label>
            <input
              type="text"
              placeholder="e.g., HDFC Regalia Credit Card"
              value={formData.cardName}
              onChange={(e) => setFormData({ ...formData, cardName: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Bank / Issuer *</label>
            <select 
              value={formData.bank}
              onChange={(e) => setFormData({ ...formData, bank: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>Select Bank</option>
              <option>HDFC Bank</option>
              <option>ICICI Bank</option>
              <option>SBI</option>
              <option>Axis Bank</option>
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Card Description</label>
          <textarea
            rows={4}
            placeholder="Describe the card's main features and benefits..."
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Card Image</label>
          <input
            type="file"
            accept="image/*"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Card Type *</label>
            <select className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>Select Type</option>
              {cardTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Network *</label>
            <select className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>Select Network</option>
              {cardNetworks.map((network) => (
                <option key={network} value={network}>{network}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status *</label>
            <select className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>Enabled</option>
              <option>Disabled</option>
            </select>
          </div>
        </div>
      </div>
    );
  }

  if (sectionId === 'fees') {
    return (
      <FeesSection formData={formData} setFormData={setFormData} />
    );
  }

  if (sectionId === 'rewards') {
    return (
      <RewardsSection formData={formData} setFormData={setFormData} />
    );
  }

  if (sectionId === 'product') {
    return (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Product Description</label>
          <textarea
            rows={5}
            placeholder="Enter a detailed description of the product..."
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Product Features (One per line)</label>
          <textarea
            rows={5}
            placeholder="Enter each feature on a new line..."
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    );
  }

  if (sectionId === 'perks') {
    return (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Special Perks (One per line)</label>
          <textarea
            rows={5}
            placeholder="Enter each perk on a new line..."
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Offers (One per line)</label>
          <textarea
            rows={5}
            placeholder="Enter each offer on a new line..."
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    );
  }

  if (sectionId === 'eligibility') {
    return (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Eligibility Criteria (One per line)</label>
          <textarea
            rows={5}
            placeholder="Enter each criterion on a new line..."
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    );
  }

  if (sectionId === 'pros') {
    return (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Pros (One per line)</label>
          <textarea
            rows={5}
            placeholder="Enter each pro on a new line..."
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Cons (One per line)</label>
          <textarea
            rows={5}
            placeholder="Enter each con on a new line..."
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    );
  }

  return null;
}

function FeesSection({ formData, setFormData }: { formData: any; setFormData: (data: any) => void }) {
  const [customFees, setCustomFees] = useState<Array<{ id: number; feeType: string; amount: string }>>([]);
  const [nextId, setNextId] = useState(1);

  const addCustomFee = () => {
    setCustomFees([...customFees, { id: nextId, feeType: '', amount: '' }]);
    setNextId(nextId + 1);
  };

  const removeCustomFee = (id: number) => {
    setCustomFees(customFees.filter(fee => fee.id !== id));
  };

  const updateCustomFee = (id: number, field: 'feeType' | 'amount', value: string) => {
    setCustomFees(customFees.map(fee => 
      fee.id === id ? { ...fee, [field]: value } : fee
    ));
  };

  return (
    <div className="space-y-4">
      <div>
        <div className="border border-gray-300 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border-b border-gray-300">Fee Type</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border-b border-gray-300">Amount</th>
                <th className="px-4 py-3 w-16 border-b border-gray-300"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {/* Primary Fees */}
              <tr>
                <td className="px-4 py-3 text-sm font-medium text-gray-700">Joining Fee *</td>
                <td className="px-4 py-3">
                  <input
                    type="text"
                    placeholder="e.g., ₹500 or Free"
                    value={formData.joiningFee}
                    onChange={(e) => setFormData({ ...formData, joiningFee: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </td>
                <td className="px-4 py-3"></td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm font-medium text-gray-700">Annual Fee *</td>
                <td className="px-4 py-3">
                  <input
                    type="text"
                    placeholder="e.g., ₹500 or Nil"
                    value={formData.renewalFee}
                    onChange={(e) => setFormData({ ...formData, renewalFee: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </td>
                <td className="px-4 py-3"></td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm font-medium text-gray-700">Interest Rate (APR)</td>
                <td className="px-4 py-3">
                  <input
                    type="text"
                    placeholder="e.g., 3.5% per month"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </td>
                <td className="px-4 py-3"></td>
              </tr>
              
              {/* Other Standard Fees */}
              <tr>
                <td className="px-4 py-3 text-sm font-medium text-gray-700">Late Payment Fee</td>
                <td className="px-4 py-3">
                  <input
                    type="text"
                    placeholder="e.g., ₹500"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </td>
                <td className="px-4 py-3"></td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm font-medium text-gray-700">Overlimit Fee</td>
                <td className="px-4 py-3">
                  <input
                    type="text"
                    placeholder="e.g., ₹600"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </td>
                <td className="px-4 py-3"></td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm font-medium text-gray-700">Cash Advance Fee</td>
                <td className="px-4 py-3">
                  <input
                    type="text"
                    placeholder="e.g., 2.5% or ₹300 (whichever is higher)"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </td>
                <td className="px-4 py-3"></td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm font-medium text-gray-700">Foreign Transaction Fee</td>
                <td className="px-4 py-3">
                  <input
                    type="text"
                    placeholder="e.g., 3.5% + GST"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </td>
                <td className="px-4 py-3"></td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm font-medium text-gray-700">Returned Payment Fee</td>
                <td className="px-4 py-3">
                  <input
                    type="text"
                    placeholder="e.g., ₹450"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </td>
                <td className="px-4 py-3"></td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm font-medium text-gray-700">Card Replacement Fee</td>
                <td className="px-4 py-3">
                  <input
                    type="text"
                    placeholder="e.g., ₹100"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </td>
                <td className="px-4 py-3"></td>
              </tr>
              
              {/* Custom Fee Rows */}
              {customFees.map(fee => (
                <tr key={fee.id} className="bg-blue-50">
                  <td className="px-4 py-3">
                    <input
                      type="text"
                      placeholder="Fee Type (e.g., Add-on Card Fee)"
                      value={fee.feeType}
                      onChange={(e) => updateCustomFee(fee.id, 'feeType', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="text"
                      placeholder="Amount"
                      value={fee.amount}
                      onChange={(e) => updateCustomFee(fee.id, 'amount', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => removeCustomFee(fee.id)}
                      className="p-1.5 hover:bg-red-100 rounded-lg transition-colors group"
                      title="Remove fee"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Add Custom Fee Button */}
        <button
          onClick={addCustomFee}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 mt-3 bg-blue-50 border-2 border-dashed border-blue-300 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Custom Fee Type
        </button>
      </div>
      
      {/* Fee Waiver Conditions */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Fee Waiver Conditions</label>
        <textarea
          rows={3}
          placeholder="Describe conditions to waive joining/annual fees..."
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  );
}

function RewardsSection({ formData, setFormData }: { formData: any; setFormData: (data: any) => void }) {
  const [customBenefits, setCustomBenefits] = useState<Array<{ id: number; category: string; description: string; icon: string }>>([]);
  const [nextId, setNextId] = useState(1);

  const addCustomBenefit = () => {
    setCustomBenefits([...customBenefits, { id: nextId, category: '', description: '', icon: '🎯' }]);
    setNextId(nextId + 1);
  };

  const removeCustomBenefit = (id: number) => {
    setCustomBenefits(customBenefits.filter(benefit => benefit.id !== id));
  };

  const updateCustomBenefit = (id: number, field: 'category' | 'description' | 'icon', value: string) => {
    setCustomBenefits(customBenefits.map(benefit => 
      benefit.id === id ? { ...benefit, [field]: value } : benefit
    ));
  };

  const emojiOptions = ['🎯', '💰', '🎁', '⭐', '🔥', '💎', '🏆', '📱', '🎉', '✨', '🌟', '💳', '🛍️', '🎊', '���', 
    '✈️', '🌍', '🌏', '🗺️', '🧳', '🏨', '🏖️', '⛱️', '🎭', '🎬', '🎪', '🎨', '🎮', '🎲', 
    '🍔', '🍕', '🍝', '🍜', '🍱', '🍣', '🍷', '🍸', '☕', '🍰', '🎂',
    '🚗', '⛽', '🚕', '🚙', '🏎️', '🚁', '🛩️', '🚀', '🛸',
    '💻', '⌨️', '🖥️', '📲', '💾', '🖨️', '📡', '🔌', '💡',
    '🏥', '💊', '🏋️', '⚽', '🏀', '⚾', '🎾', '🏐', '⛳', '🏌️',
    '🎓', '📚', '📖', '✏️', '📝', '📊', '📈', '📉', '💹',
    '🏪', '🏬', '🛒', '💳', '💵', '💴', '💶', '💷', '🪙', '💸',
    '🎵', '🎶', '🎤', '🎧', '🎸', '🎹', '🎺', '🎻', '🥁',
    '🌸', '🌺', '🌻', '🌷', '🌹', '🏵️', '💐', '🌿', '☘️',
    '🔒', '🔓', '🔑', '🛡️', '⚡', '🔋', '⚙️', '🛠️', '🔧',
    '👑', '💍', '👔', '👗', '👠', '👜', '🎀', '💄', '💅',
    '⏰', '⏱️', '⏲️', '⌚', '📅', '📆', '🗓️', '📌', '📍',
    '🎁', '🎀', '🎊', '🎉', '🎈', '🎆', '🎇', '✨', '🌟'];

  return (
    <div className="space-y-6">
      {/* Basic Reward Info */}
      <div className="pb-4 border-b border-gray-200">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">Basic Reward Information</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Reward Program Name</label>
            <input
              type="text"
              placeholder="e.g., HDFC RewardZ Points"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Welcome Bonus</label>
            <input
              type="text"
              placeholder="e.g., 5,000 bonus points on first purchase"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>
      
      {/* Key Benefits for Card Preview */}
      <div className="pb-4 border-b border-gray-200">
        <h3 className="text-sm font-semibold text-gray-900 mb-2">Key Benefits (For Card Preview)</h3>
        <p className="text-xs text-gray-500 mb-4">These benefits will appear on the card listing. One benefit per line.</p>
        <textarea
          rows={5}
          value={formData.benefits.join('\n')}
          onChange={(e) => setFormData({ ...formData, benefits: e.target.value.split('\n').filter((b: string) => b.trim()) })}
          placeholder="Enter each benefit on a new line&#10;e.g., Welcome bonus of 5,000 reward points&#10;Complimentary airport lounge access&#10;Fuel surcharge waiver"
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
        />
      </div>

      {/* Structured Rewards & Benefits Table */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-4">Rewards & Benefits Details (As shown in table)</h3>
        <div className="space-y-4">
          {/* Rewards Rate */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">🎁</span>
              <label className="text-sm font-medium text-gray-900">Rewards Rate</label>
            </div>
            <input
              type="text"
              placeholder="e.g., 4 points per ₹150 spent — save up to 1.3% on every transaction"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Reward Redemption */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">💳</span>
              <label className="text-sm font-medium text-gray-900">Reward Redemption</label>
            </div>
            <textarea
              rows={3}
              placeholder="e.g., You can redeem reward points for air tickets and AirMiles (1 RP = 0.50 Air Mile) on select airlines..."
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* International Lounge Access */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">✈️</span>
              <label className="text-sm font-medium text-gray-900">International Lounge Access</label>
            </div>
            <input
              type="text"
              placeholder="e.g., 6 complimentary visits per year or N/A"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Domestic Lounge Access */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">🛋️</span>
              <label className="text-sm font-medium text-gray-900">Domestic Lounge Access</label>
            </div>
            <input
              type="text"
              placeholder="e.g., 6 complimentary visits per year or N/A"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Insurance Benefits */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">🛡️</span>
              <label className="text-sm font-medium text-gray-900">Insurance Benefits</label>
            </div>
            <textarea
              rows={2}
              placeholder="e.g., Air accident cover of ₹1 Cr + medical and baggage insurance"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Travel */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">🌍</span>
              <label className="text-sm font-medium text-gray-900">Travel Benefits</label>
            </div>
            <textarea
              rows={2}
              placeholder="e.g., Access to 1,000+ global lounges + bonus points on bookings"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Movie & Dining */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">🎬</span>
              <label className="text-sm font-medium text-gray-900">Movie & Dining</label>
            </div>
            <input
              type="text"
              placeholder="e.g., Buy 1 Get 1 free on movie tickets or N/A"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Golf */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">⛳</span>
              <label className="text-sm font-medium text-gray-900">Golf Benefits</label>
            </div>
            <input
              type="text"
              placeholder="e.g., Complimentary golf sessions at select courses or N/A"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Custom Benefits */}
          {customBenefits.map(benefit => (
            <div key={benefit.id} className="bg-white border-2 border-dashed border-blue-300 rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3 flex-1">
                  <select
                    value={benefit.icon}
                    onChange={(e) => updateCustomBenefit(benefit.id, 'icon', e.target.value)}
                    className="text-lg bg-gray-50 border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {emojiOptions.map(emoji => (
                      <option key={emoji} value={emoji}>{emoji}</option>
                    ))}
                  </select>
                  <input
                    type="text"
                    placeholder="Benefit Category Name (e.g., Fuel Benefits)"
                    value={benefit.category}
                    onChange={(e) => updateCustomBenefit(benefit.id, 'category', e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <button
                  onClick={() => removeCustomBenefit(benefit.id)}
                  className="p-2 hover:bg-red-50 rounded-lg transition-colors group ml-2"
                  title="Remove benefit"
                >
                  <Trash2 className="w-4 h-4 text-red-600" />
                </button>
              </div>
              <textarea
                rows={2}
                placeholder="Description of this benefit..."
                value={benefit.description}
                onChange={(e) => updateCustomBenefit(benefit.id, 'description', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ))}

          {/* Add Custom Benefit Button */}
          <button
            onClick={addCustomBenefit}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-50 border-2 border-dashed border-blue-300 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Custom Benefit / Reward
          </button>
        </div>
      </div>

      {/* Cashback Rate (Additional) */}
      <div className="pt-4 border-t border-gray-200">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">Additional Benefits</h3>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Cashback Rate</label>
          <input
            type="text"
            placeholder="e.g., 5% on online purchases, 2% on offline"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  );
}

function BanksManagementContent({
  cardTypes,
  setCardTypes,
  cardNetworks,
  setCardNetworks
}: {
  cardTypes: string[];
  setCardTypes: (types: string[]) => void;
  cardNetworks: string[];
  setCardNetworks: (networks: string[]) => void;
}) {
  const [banks, setBanks] = useState([
    { id: 1, name: 'HDFC Bank', description: 'Leading private sector bank with extensive network', logo: '', status: 'Enabled' },
    { id: 2, name: 'ICICI Bank', description: 'Second-largest private sector bank in India', logo: '', status: 'Enabled' },
    { id: 3, name: 'SBI', description: 'India\'s largest public sector bank', logo: '', status: 'Enabled' },
    { id: 4, name: 'Axis Bank', description: 'Third-largest private sector bank', logo: '', status: 'Enabled' },
  ]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingBank, setEditingBank] = useState<{ id: number; name: string; description: string; logo: string; status: string } | null>(null);
  const [newBankName, setNewBankName] = useState('');
  const [newBankDescription, setNewBankDescription] = useState('');
  const [newBankLogo, setNewBankLogo] = useState('');
  const [logoFileName, setLogoFileName] = useState('');
  
  // Card Type management state
  const [newCardType, setNewCardType] = useState('');
  const [showAddTypeModal, setShowAddTypeModal] = useState(false);
  const [deleteConfirmType, setDeleteConfirmType] = useState<string | null>(null);
  
  // Card Network management state
  const [newCardNetwork, setNewCardNetwork] = useState('');
  const [showAddNetworkModal, setShowAddNetworkModal] = useState(false);
  const [deleteConfirmNetwork, setDeleteConfirmNetwork] = useState<string | null>(null);

  const handleAddBank = () => {
    if (newBankName.trim()) {
      const newBank = {
        id: banks.length + 1,
        name: newBankName.trim(),
        description: newBankDescription.trim(),
        logo: newBankLogo,
        status: 'Enabled'
      };
      setBanks([...banks, newBank]);
      setNewBankName('');
      setNewBankDescription('');
      setNewBankLogo('');
      setLogoFileName('');
      setShowAddModal(false);
    }
  };

  const handleEditBank = () => {
    if (editingBank && newBankName.trim()) {
      setBanks(banks.map(bank => 
        bank.id === editingBank.id 
          ? { ...bank, name: newBankName.trim(), description: newBankDescription.trim(), logo: newBankLogo }
          : bank
      ));
      setNewBankName('');
      setNewBankDescription('');
      setNewBankLogo('');
      setLogoFileName('');
      setEditingBank(null);
    }
  };

  const handleDeleteBank = (id: number) => {
    if (confirm('Are you sure you want to delete this bank?')) {
      setBanks(banks.filter(bank => bank.id !== id));
    }
  };

  const toggleBankStatus = (id: number) => {
    setBanks(banks.map(bank => 
      bank.id === id 
        ? { ...bank, status: bank.status === 'Enabled' ? 'Disabled' : 'Enabled' }
        : bank
    ));
  };

  const openEditModal = (bank: typeof banks[0]) => {
    setEditingBank(bank);
    setNewBankName(bank.name);
    setNewBankDescription(bank.description);
    setNewBankLogo(bank.logo);
    setLogoFileName(bank.logo ? 'Uploaded' : '');
  };

  const closeModal = () => {
    setShowAddModal(false);
    setEditingBank(null);
    setNewBankName('');
    setNewBankDescription('');
    setNewBankLogo('');
    setLogoFileName('');
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewBankLogo(reader.result as string);
        setLogoFileName(file.name);
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Card Type handlers
  const handleAddCardType = () => {
    if (newCardType.trim() && !cardTypes.includes(newCardType.trim())) {
      setCardTypes([...cardTypes, newCardType.trim()]);
      setNewCardType('');
      setShowAddTypeModal(false);
    }
  };
  
  const handleDeleteCardType = (type: string) => {
    setCardTypes(cardTypes.filter(t => t !== type));
    setDeleteConfirmType(null);
  };
  
  // Card Network handlers
  const handleAddCardNetwork = () => {
    if (newCardNetwork.trim() && !cardNetworks.includes(newCardNetwork.trim())) {
      setCardNetworks([...cardNetworks, newCardNetwork.trim()]);
      setNewCardNetwork('');
      setShowAddNetworkModal(false);
    }
  };
  
  const handleDeleteCardNetwork = (network: string) => {
    setCardNetworks(cardNetworks.filter(n => n !== network));
    setDeleteConfirmNetwork(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Building2 className="w-5 h-5 text-blue-600" />
          <h1 className="text-xl font-bold text-gray-900">Banks Management</h1>
        </div>
        <div className="text-sm text-gray-500">Stored in Supabase</div>
      </div>

      {/* Add Bank Button */}
      <div className="flex items-center gap-3">
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Bank
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Bank Name</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {banks.map((bank) => (
                <tr key={bank.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-4 text-sm font-medium text-gray-900">{bank.name}</td>
                  <td className="px-4 py-4">
                    <button
                      onClick={() => toggleBankStatus(bank.id)}
                      className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold cursor-pointer transition-colors ${
                        bank.status === 'Enabled' 
                          ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                      }`}
                    >
                      {bank.status}
                    </button>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => openEditModal(bank)}
                        className="p-2 hover:bg-blue-50 rounded-lg transition-colors group"
                        title="Edit bank"
                      >
                        <Edit2 className="w-4 h-4 text-blue-600" />
                      </button>
                      <button 
                        onClick={() => handleDeleteBank(bank.id)}
                        className="p-2 hover:bg-red-50 rounded-lg transition-colors group"
                        title="Delete bank"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Results count */}
      <div className="text-sm text-gray-600">
        Showing {banks.length} of {banks.length} banks
      </div>

      {/* Card Types Section */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-bold text-gray-900">Card Types</h2>
          </div>
          <button 
            onClick={() => setShowAddTypeModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Type
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {cardTypes.map((type) => (
            <div key={type} className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg">
              <span className="text-sm font-medium text-gray-700">{type}</span>
              <button
                onClick={() => setDeleteConfirmType(type)}
                className="p-0.5 hover:bg-red-100 rounded transition-colors"
                title="Delete type"
              >
                <X className="w-3.5 h-3.5 text-red-600" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Card Networks Section */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-bold text-gray-900">Card Networks</h2>
          </div>
          <button 
            onClick={() => setShowAddNetworkModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Network
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {cardNetworks.map((network) => (
            <div key={network} className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg">
              <span className="text-sm font-medium text-gray-700">{network}</span>
              <button
                onClick={() => setDeleteConfirmNetwork(network)}
                className="p-0.5 hover:bg-red-100 rounded transition-colors"
                title="Delete network"
              >
                <X className="w-3.5 h-3.5 text-red-600" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {(showAddModal || editingBank) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900">
                  {editingBank ? 'Edit Bank' : 'Add New Bank'}
                </h2>
                <button
                  onClick={closeModal}
                  className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bank Name *
                </label>
                <input
                  type="text"
                  value={newBankName}
                  onChange={(e) => setNewBankName(e.target.value)}
                  placeholder="e.g., Kotak Mahindra Bank"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      editingBank ? handleEditBank() : handleAddBank();
                    }
                  }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bank Description
                </label>
                <textarea
                  rows={3}
                  value={newBankDescription}
                  onChange={(e) => setNewBankDescription(e.target.value)}
                  placeholder="Enter a brief description of the bank..."
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bank Logo <span className="text-gray-500">(PNG or SVG only)</span>
                </label>
                <div className="space-y-3">
                  {/* File Input */}
                  <div className="relative">
                    <input
                      type="file"
                      accept=".png,.svg,image/png,image/svg+xml"
                      onChange={handleLogoUpload}
                      id="logo-upload"
                      className="hidden"
                    />
                    <label
                      htmlFor="logo-upload"
                      className="flex items-center justify-center gap-2 w-full px-4 py-2.5 border-2 border-dashed border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:border-blue-500 hover:text-blue-600 cursor-pointer transition-colors"
                    >
                      <Upload className="w-4 h-4" />
                      {logoFileName ? 'Change Logo' : 'Upload Logo'}
                    </label>
                  </div>

                  {/* File Info */}
                  {logoFileName && (
                    <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-blue-100 rounded">
                          <Building2 className="w-4 h-4 text-blue-600" />
                        </div>
                        <span className="text-sm font-medium text-blue-900">{logoFileName}</span>
                      </div>
                      <button
                        onClick={() => {
                          setNewBankLogo('');
                          setLogoFileName('');
                        }}
                        className="p-1 hover:bg-blue-100 rounded transition-colors"
                        title="Remove logo"
                      >
                        <X className="w-4 h-4 text-blue-600" />
                      </button>
                    </div>
                  )}

                  {/* Logo Preview */}
                  {newBankLogo && (
                    <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                      <p className="text-xs font-medium text-gray-700 mb-2">Preview:</p>
                      <div className="flex items-center justify-center p-4 bg-white rounded border border-gray-200">
                        <img 
                          src={newBankLogo} 
                          alt="Bank logo preview" 
                          className="max-h-16 max-w-full object-contain"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex items-center justify-end gap-3">
              <button
                onClick={closeModal}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={editingBank ? handleEditBank : handleAddBank}
                disabled={!newBankName.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {editingBank ? 'Save Changes' : 'Add Bank'}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Add Card Type Modal */}
      {showAddTypeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900">Add New Card Type</h2>
                <button
                  onClick={() => {
                    setShowAddTypeModal(false);
                    setNewCardType('');
                  }}
                  className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type Name *
              </label>
              <input
                type="text"
                value={newCardType}
                onChange={(e) => setNewCardType(e.target.value)}
                placeholder="e.g., Fuel, Business, Premium"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleAddCardType();
                  }
                }}
              />
            </div>
            <div className="p-6 border-t border-gray-200 flex items-center justify-end gap-3">
              <button
                onClick={() => {
                  setShowAddTypeModal(false);
                  setNewCardType('');
                }}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddCardType}
                disabled={!newCardType.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Type
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Add Card Network Modal */}
      {showAddNetworkModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900">Add New Card Network</h2>
                <button
                  onClick={() => {
                    setShowAddNetworkModal(false);
                    setNewCardNetwork('');
                  }}
                  className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Network Name *
              </label>
              <input
                type="text"
                value={newCardNetwork}
                onChange={(e) => setNewCardNetwork(e.target.value)}
                placeholder="e.g., Diners Club, UnionPay"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleAddCardNetwork();
                  }
                }}
              />
            </div>
            <div className="p-6 border-t border-gray-200 flex items-center justify-end gap-3">
              <button
                onClick={() => {
                  setShowAddNetworkModal(false);
                  setNewCardNetwork('');
                }}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddCardNetwork}
                disabled={!newCardNetwork.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Network
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Delete Card Type Confirmation Modal */}
      {deleteConfirmType && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-900">Delete Card Type</h2>
            </div>
            <div className="p-6">
              <p className="text-sm text-gray-600">
                Are you sure you want to delete the card type <span className="font-semibold text-gray-900">"{deleteConfirmType}"</span>?
              </p>
              <p className="text-sm text-gray-500 mt-2">
                This action cannot be undone.
              </p>
            </div>
            <div className="p-6 border-t border-gray-200 flex items-center justify-end gap-3">
              <button
                onClick={() => setDeleteConfirmType(null)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteCardType(deleteConfirmType)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Delete Card Network Confirmation Modal */}
      {deleteConfirmNetwork && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-900">Delete Card Network</h2>
            </div>
            <div className="p-6">
              <p className="text-sm text-gray-600">
                Are you sure you want to delete the card network <span className="font-semibold text-gray-900">"{deleteConfirmNetwork}"</span>?
              </p>
              <p className="text-sm text-gray-500 mt-2">
                This action cannot be undone.
              </p>
            </div>
            <div className="p-6 border-t border-gray-200 flex items-center justify-end gap-3">
              <button
                onClick={() => setDeleteConfirmNetwork(null)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteCardNetwork(deleteConfirmNetwork)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}