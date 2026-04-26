import RobloxLogo from './RobloxLogo';

export default function WinnerList({ winners, onDelete }) {
  if (winners.length === 0) {
    return (
      <div className="empty-state">
        <div className="icon">🏅</div>
        <p>Aún no hay ganadores registrados.<br />Busca un usuario y selecciona un premio.</p>
      </div>
    );
  }

  return (
    <>
      {winners.map((winner) => (
        <div className="winner-item" id={`w_${winner.id}`} key={winner.id}>
          <div className="w-avatar">
            {winner.avatarUrl ? (
              <img src={winner.avatarUrl} alt={winner.username} onError={(event) => { event.currentTarget.style.display = 'none'; }} />
            ) : null}
          </div>
          <div className="w-info">
            <div className="w-name">{winner.username}</div>
            <div className="w-prize"><RobloxLogo className="rbx-inline" size={11} /> {Number(winner.robux).toLocaleString()} Robux</div>
            <div className="w-date">📅 {winner.date}</div>
          </div>
          <button className="w-del" title="Eliminar" onClick={() => onDelete(winner.id)}>✕</button>
        </div>
      ))}
    </>
  );
}
