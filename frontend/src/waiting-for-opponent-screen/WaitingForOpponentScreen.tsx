import React from 'react';
import './WaitingForOpponentScreen.scss';

type WaitingForOpponentScreenProps = {};

const WaitingForOpponentScreen = React.memo<WaitingForOpponentScreenProps>(
  () => {
    return <div className="waiting">Waiting for opponent …</div>;
  },
);

WaitingForOpponentScreen.displayName = 'WaitingForOpponentScreen';

export default WaitingForOpponentScreen;
