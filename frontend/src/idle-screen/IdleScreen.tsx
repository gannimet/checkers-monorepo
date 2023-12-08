import React from 'react';

type IdleScreenProps = {
  onPlayBtnClick: () => void;
};

const IdleScreen = React.memo<IdleScreenProps>(({ onPlayBtnClick }) => {
  return (
    <div>
      <button onClick={() => onPlayBtnClick()}>I want to play!</button>
    </div>
  );
});

IdleScreen.displayName = 'IdleScreen';

export default IdleScreen;
