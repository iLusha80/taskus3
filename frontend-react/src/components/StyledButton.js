import styled from 'styled-components';

const StyledButton = styled.button`
  padding: ${({ theme }) => theme.spacing.small} ${({ theme }) => theme.spacing.medium};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  cursor: pointer;
  font-size: 1em;
  transition: background-color 0.3s ease, opacity 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.small};
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};

  &:hover {
    background-color: ${({ theme }) => theme.colors.primary};
    opacity: 0.9;
  }

  &:active {
    opacity: 0.7;
  }

  /* Variations */
  &.secondary {
    background-color: ${({ theme }) => theme.colors.grayMedium};
    color: ${({ theme }) => theme.colors.text};
    &:hover {
      background-color: ${({ theme }) => theme.colors.grayDark};
      color: ${({ theme }) => theme.colors.white};
    }
  }

  &.danger {
    background-color: ${({ theme }) => theme.colors.danger};
    color: ${({ theme }) => theme.colors.white};
    &:hover {
      background-color: ${({ theme }) => theme.colors.danger};
      opacity: 0.8;
    }
  }

  &:disabled {
    background-color: ${({ theme }) => theme.colors.grayLight};
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

export default StyledButton;