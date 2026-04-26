import RobloxLogo from './RobloxLogo';

const ROBUX_OPTIONS = [
  { amount: 1000, label: '1,000 R$' },
  { amount: 2000, label: '2,000 R$' },
  { amount: 3000, label: '3,000 R$' },
  { amount: 5000, label: '5,000 R$' }
];

export default function RobuxSelector({ selectedRobux, onSelect, disabled = false }) {
  return (
    <div className="robux-grid" id="robuxGrid">
      {ROBUX_OPTIONS.map((option) => (
        <button
          key={option.amount}
          className={`robux-btn ${selectedRobux === option.amount ? 'selected' : ''}`}
          disabled={disabled}
          onClick={() => onSelect(option.amount)}
        >
          <span className="icon"><RobloxLogo size={16} /></span>
          {option.label}
        </button>
      ))}
    </div>
  );
}
