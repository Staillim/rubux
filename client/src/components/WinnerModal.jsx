import { useEffect, useMemo } from 'react';
import RobloxLogo from './RobloxLogo';

function createConfettiPieces(amount = 30) {
  const colors = ['#00e5ff', '#00ff88', '#ffffff', '#ffcc00', '#ff4488'];
  return Array.from({ length: amount }).map((_, index) => ({
    id: index,
    size: Math.random() * 8 + 4,
    color: colors[Math.floor(Math.random() * colors.length)],
    radius: Math.random() > 0.5 ? '50%' : '2px',
    left: `${Math.random() * 100}%`,
    duration: `${1.5 + Math.random() * 1.5}s`,
    delay: `${Math.random() * 0.8}s`
  }));
}

function playSound() {
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    const ctx = new AudioContextClass();
    const notes = [523, 659, 784, 1047];
    notes.forEach((freq, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.12, ctx.currentTime + index * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + index * 0.1 + 0.3);
      osc.start(ctx.currentTime + index * 0.1);
      osc.stop(ctx.currentTime + index * 0.1 + 0.3);
    });
  } catch (_error) {
    // Ignore audio errors on restricted browsers.
  }
}

export default function WinnerModal({ winner, onClose }) {
  const confettiPieces = useMemo(() => createConfettiPieces(), [winner?.id]);

  useEffect(() => {
    if (!winner) return;
    playSound();
  }, [winner]);

  useEffect(() => {
    if (!winner) return;
    function handleEscape(event) {
      if (event.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [winner, onClose]);

  if (!winner) return null;

  return (
    <div className="modal-overlay show" id="modalOverlay" onClick={onClose}>
      <div className="modal" id="modal" onClick={(event) => event.stopPropagation()}>
        <div className="confetti-wrap" id="confettiWrap">
          {confettiPieces.map((piece) => (
            <div
              key={piece.id}
              style={{
                position: 'absolute',
                width: `${piece.size}px`,
                height: `${piece.size}px`,
                background: piece.color,
                borderRadius: piece.radius,
                left: piece.left,
                top: '-10px',
                animation: `confettiFall ${piece.duration} ease ${piece.delay} forwards`,
                opacity: 1
              }}
            />
          ))}
        </div>
        <div className="modal-emoji">🎉</div>
        <h2>¡GANADOR REGISTRADO!</h2>
        <div className="modal-avatar-wrap">
          {winner.avatarUrl ? <img id="modalAvatar" src={winner.avatarUrl} alt={winner.username} /> : null}
        </div>
        <div className="modal-username" id="modalUsername">{winner.username}</div>
        <div className="modal-prize" id="modalPrize"><RobloxLogo className="rbx-inline" size={14} /> {winner.robux.toLocaleString()} Robux</div>
        <div className="modal-note">
          ✅ Este usuario ha sido agregado a la lista de ganadores.
          <br />
          La entrega se realizará <strong>posteriormente</strong> por el creador.
        </div>
        <button className="btn btn-primary" style={{ width: '100%', fontSize: 14, padding: 13 }} onClick={onClose}>CERRAR</button>
      </div>
    </div>
  );
}
