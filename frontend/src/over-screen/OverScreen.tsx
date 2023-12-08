import React from 'react';

type OverScreenProps = {
  localPlayerHasWon: boolean;
  onPlayBtnClick: () => void;
};

const OverScreen = React.memo<OverScreenProps>(
  ({ localPlayerHasWon, onPlayBtnClick }) => {
    return (
      <div>
        <h1>{localPlayerHasWon ? 'You won!' : 'You lost!'}</h1>
        <div>
          <button onClick={() => onPlayBtnClick()}>Play again!</button>
        </div>
      </div>
    );
  },
);

OverScreen.displayName = 'OverScreen';

export default OverScreen;
