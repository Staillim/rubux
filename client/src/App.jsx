import { useMemo, useState } from 'react';
import AvatarPreview from './components/AvatarPreview';
import RobuxSelector from './components/RobuxSelector';
import WinnerList from './components/WinnerList';
import WinnerModal from './components/WinnerModal';
import RobloxLogo from './components/RobloxLogo';
import { fetchRobloxUser } from './services/robloxApi';
import { exportWinnersToJson, getWinners, saveWinners } from './services/winnerStorage';

export default function App() {
  const [usernameInput, setUsernameInput] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedRobux, setSelectedRobux] = useState(null);
  const [winners, setWinners] = useState(getWinners);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [modalWinner, setModalWinner] = useState(null);

  const canRegister = useMemo(() => Boolean(currentUser && selectedRobux), [currentUser, selectedRobux]);

  function persistWinners(nextWinners) {
    setWinners(nextWinners);
    saveWinners(nextWinners);
  }

  async function searchUser() {
    const username = usernameInput.trim();
    if (!username) return;

    setLoading(true);
    setError('');
    setCurrentUser(null);
    setSelectedRobux(null);

    try {
      const user = await fetchRobloxUser(username);
      setCurrentUser(user);
    } catch (requestError) {
      setError(requestError.message || 'No se pudo conectar con Roblox.');
    } finally {
      setLoading(false);
    }
  }

  async function registerWinner() {
    if (!canRegister || isSubmitting) return;

    const userToRegister = currentUser;
    const robuxToRegister = selectedRobux;

    setIsSubmitting(true);
    await new Promise((resolve) => {
      setTimeout(resolve, 5000);
    });

    if (!userToRegister || !robuxToRegister) {
      setIsSubmitting(false);
      return;
    }

    const winner = {
      id: Date.now(),
      username: userToRegister.username,
      userId: userToRegister.userId,
      avatarUrl: userToRegister.avatarUrl,
      robux: robuxToRegister,
      date: new Date().toLocaleString('es-CO', { dateStyle: 'short', timeStyle: 'short' })
    };

    const nextWinners = [winner, ...winners];
    persistWinners(nextWinners);
    setModalWinner(winner);

    setCurrentUser(null);
    setSelectedRobux(null);
    setUsernameInput('');
    setError('');
    setIsSubmitting(false);
  }

  function deleteWinner(id) {
    const element = document.getElementById(`w_${id}`);
    if (!element) {
      persistWinners(winners.filter((winner) => winner.id !== id));
      return;
    }

    element.style.transition = 'all 0.3s';
    element.style.opacity = '0';
    element.style.transform = 'translateX(20px)';

    setTimeout(() => {
      persistWinners(winners.filter((winner) => winner.id !== id));
    }, 280);
  }

  function clearAll() {
    if (winners.length === 0) return;
    if (window.confirm(`¿Borrar los ${winners.length} ganador(es) registrados?`)) {
      persistWinners([]);
    }
  }

  function exportWinners() {
    if (winners.length === 0) {
      window.alert('No hay ganadores para exportar.');
      return;
    }
    exportWinnersToJson(winners);
  }

  return (
    <>
      <header>
        <h1 className="title-brand"><RobloxLogo className="title-logo" size={26} /> ROBLOX GENERATOR</h1>
      </header>

      <div className="app">
        <div className="left-col">
          <div className="card">
            <div className="section-title">🔍 Buscar usuario</div>
            <div className="search-wrap">
              <input
                type="text"
                id="usernameInput"
                placeholder="Username de Roblox..."
                autoComplete="off"
                disabled={loading || isSubmitting}
                value={usernameInput}
                onChange={(event) => setUsernameInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' && !isSubmitting) searchUser();
                }}
              />
              <button className="btn btn-primary" id="searchBtn" onClick={searchUser} disabled={loading || isSubmitting}>
                {loading ? '...' : 'BUSCAR'}
              </button>
            </div>

            <AvatarPreview loading={loading} error={error} currentUser={currentUser} />

            <div className="section-title"><RobloxLogo className="rbx-inline" size={13} /> Premio</div>
            <RobuxSelector selectedRobux={selectedRobux} onSelect={setSelectedRobux} disabled={isSubmitting} />

            <button className="btn btn-success" id="registerBtn" onClick={registerWinner} disabled={!canRegister || isSubmitting}>
              {isSubmitting ? 'ENVIANDO...' : 'ENVIAR'}
            </button>
            {isSubmitting ? (
              <div className="submit-loading" role="status" aria-live="polite">
                <div className="submit-loading-spinner" />
                <span>Procesando solicitud...</span>
                <div className="submit-loading-bar" />
              </div>
            ) : null}
          </div>

        </div>

        <div className="right-col">
          <div className="card">
            <div className="history-header">
              <div className="section-title" style={{ marginBottom: 0 }}>
                🏅 Historial de ganadores
                <span className="count-badge" id="countBadge">{winners.length}</span>
              </div>
              <div className="history-actions">
                <button className="btn btn-ghost" title="Exportar JSON" style={{ padding: '8px 12px', fontSize: 12 }} onClick={exportWinners}>📤 Exportar</button>
                <button className="btn btn-danger" title="Limpiar lista" style={{ padding: '8px 12px', fontSize: 12 }} onClick={clearAll}>🧹 Limpiar</button>
              </div>
            </div>

            <div className="winner-list" id="winnerList">
              <WinnerList winners={winners} onDelete={deleteWinner} />
            </div>
          </div>
        </div>
      </div>

      <WinnerModal winner={modalWinner} onClose={() => setModalWinner(null)} />
    </>
  );
}
