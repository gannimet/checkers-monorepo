import React from 'react';

type AbortedScreenProps = {
  onPlayBtnClick: () => void;
};

const AbortedScreen = React.memo<AbortedScreenProps>(({ onPlayBtnClick }) => {
  return (
    <div>
      <div>Game was aborted</div>
      <div>
        <button onClick={() => onPlayBtnClick()}>Play again!</button>
      </div>
    </div>
  );
});

AbortedScreen.displayName = 'AbortedScreen';

export default AbortedScreen;
