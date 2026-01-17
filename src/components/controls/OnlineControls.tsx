import React, { useState } from 'react';
import { useGame } from '../../context';
import { clearGameIdFromUrl } from '../../utils';

interface OnlineControlsProps {
  isCreating: boolean;
}

const OnlineControls: React.FC<OnlineControlsProps> = ({ isCreating }) => {
  const { onlineState, getShareableLink, leaveOnlineGame } = useGame();
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(getShareableLink());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLeaveGame = () => {
    leaveOnlineGame();
    clearGameIdFromUrl();
  };

  const renderContent = () => {
    if (onlineState.status === 'error') {
      return (
        <div className="online-error">
          <p className="error-message">{onlineState.error}</p>
          <button className="btn btn-secondary" onClick={handleLeaveGame}>
            Back to Menu
          </button>
        </div>
      );
    }

    if (onlineState.status === 'creating' || isCreating || onlineState.status === 'joining') {
      const message = onlineState.status === 'joining' ? 'Joining game...' : 'Creating game...';
      return <div className="online-status"><p>{message}</p></div>;
    }

    const playersNeeded = onlineState.playerCount - onlineState.playersJoined;
    return (
      <div className="online-waiting">
        <h3>Waiting for {playersNeeded} more player{playersNeeded !== 1 ? 's' : ''}...</h3>
        <p className="player-status">{onlineState.playersJoined} of {onlineState.playerCount} players joined</p>
        <p>Share this link with friends:</p>
        <div className="share-link-container">
          <input
            type="text"
            readOnly
            value={getShareableLink()}
            className="share-link-input"
            onClick={(e) => (e.target as HTMLInputElement).select()}
          />
          <button className="btn btn-primary" onClick={handleCopyLink}>
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
        <button className="btn btn-secondary" onClick={handleLeaveGame}>
          Cancel
        </button>
      </div>
    );
  };

  return <div className="online-controls">{renderContent()}</div>;
};

export default OnlineControls;
