export default function AvatarPreview({ loading, error, currentUser }) {
  if (loading) {
    return (
      <div className="avatar-box" id="avatarBox">
        <div className="avatar-img-wrap"><div className="loading-spin" /></div>
        <div className="avatar-info"><div style={{ color: 'var(--text-secondary)', fontSize: 13 }}>Buscando usuario...</div></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="avatar-box" id="avatarBox">
        <div className="avatar-img-wrap" />
        <div className="avatar-info"><div className="err-msg">⚠️ {error}</div></div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="avatar-box" id="avatarBox">
        <div className="avatar-img-wrap">
          <svg className="avatar-placeholder" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="8" r="4" stroke="#7a9ab8" strokeWidth="1.5" />
            <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="#7a9ab8" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>
        <div className="avatar-info">
          <div style={{ color: 'var(--text-muted)', fontSize: 13 }}>Escribe un username para buscar</div>
        </div>
      </div>
    );
  }

  return (
    <div className="avatar-box loaded" id="avatarBox">
      <div className="avatar-img-wrap pulse">
        {currentUser.avatarUrl ? (
          <img src={currentUser.avatarUrl} alt={currentUser.username} onError={(event) => { event.currentTarget.style.display = 'none'; }} />
        ) : (
          <svg className="avatar-placeholder" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="8" r="4" stroke="#7a9ab8" strokeWidth="1.5" />
            <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="#7a9ab8" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        )}
      </div>
      <div className="avatar-info">
        <div className="avatar-name">{currentUser.username}</div>
        <div className="avatar-id">ID: {currentUser.userId}</div>
        <div className="avatar-confirm">¿Ese eres tú? 👆</div>
      </div>
    </div>
  );
}
