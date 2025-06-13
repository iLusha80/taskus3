import React from 'react';
import styled from 'styled-components';

const ProgressBarContainer = styled.div`
  width: 100%;
  background-color: ${({ theme }) => theme.colors.grayLight};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  overflow: hidden;
  height: 10px; /* Standard height */
`;

const ProgressBarFill = styled.div`
  height: 100%;
  width: ${({ progress }) => progress}%;
  background-color: ${({ theme }) => theme.colors.primary}; /* Standard primary color */
  border-radius: ${({ theme }) => theme.borderRadius.small};
  transition: width 0.5s ease-in-out;
`;

const ProgressBar = ({ progress }) => {
  return (
    <ProgressBarContainer>
      <ProgressBarFill progress={progress} />
    </ProgressBarContainer>
  );
};

export default ProgressBar;