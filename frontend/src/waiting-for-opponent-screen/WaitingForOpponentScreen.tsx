import React from 'react';

type WaitingForOpponentScreenProps = {};

const WaitingForOpponentScreen = React.memo<WaitingForOpponentScreenProps>(
  () => {
    return <div>Waiting for opponent …</div>;
  },
);

WaitingForOpponentScreen.displayName = 'WaitingForOpponentScreen';

export default WaitingForOpponentScreen;
