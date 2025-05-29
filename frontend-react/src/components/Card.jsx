import React from 'react';
import styled from 'styled-components';

const StyledCard = styled.div`
  background-color: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.grayLight};
  border-radius: ${({ theme }) => theme.borderRadius.large}; /* Use large border radius */
  padding: ${({ theme }) => theme.spacing.large};
  margin-bottom: ${({ theme }) => theme.spacing.small};
  box-shadow: ${({ theme }) => theme.boxShadow.medium}; /* Use medium shadow */
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  cursor: grab;
  position: relative; /* Add relative positioning for absolute children */

  &:hover {
    transform: translateY(-5px);
    box-shadow: ${({ theme }) => theme.boxShadow.large}; /* Use large shadow on hover */
  }
`;

const CardContent = styled.div`
  padding-bottom: ${({ theme }) => theme.spacing.small};
  border-bottom: 1px solid ${({ theme }) => theme.colors.grayLight};
  margin-bottom: ${({ theme }) => theme.spacing.small};
`;

const CardTitle = styled.h4`
  margin-top: 0;
  margin-bottom: 0; /* Remove margin-bottom */
  padding-bottom: ${({ theme }) => theme.spacing.xsmall}; /* Add padding-bottom */
  border-bottom: 1px solid ${({ theme }) => theme.colors.grayLight}; /* Add thin line */
  font-size: ${({ theme }) => theme.typography.cardTitle.fontSize}; /* Use body font size for title */
  color: ${({ theme }) => theme.colors.text}; /* Use primary text color */
  font-weight: ${({ theme }) => theme.typography.heading3.fontWeight}; /* Use heading3 weight */
`;

const CardDescription = styled.p`
  margin-top: ${({ theme }) => theme.spacing.xsmall}; /* Add margin-top to separate from title */
  font-size: ${({ theme }) => theme.typography.xsmall.fontSize}; /* Use small font size */
  color: ${({ theme }) => theme.typography.small.color}; /* Use small text color */
  line-height: ${({ theme }) => theme.typography.body.lineHeight};
  margin-bottom: 0; /* Remove margin-bottom */
`;

const CloseButton = styled.button`
  position: absolute;
  top: 5px;
  right: 5px;
  background: none;
  border: none;
  font-size: 1.2em;
  color: ${({ theme }) => theme.colors.grayDark};
  cursor: pointer;
  opacity: 0.6;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 1;
  }
`;


function Card({ card, onDelete, onEdit }) {
  const { id, title, description } = card;

  return (
    <StyledCard onClick={() => onEdit(card)}>
      <CardContent>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardContent>
      <CloseButton onClick={(e) => { e.stopPropagation(); onDelete(id); }}>
        &times;
      </CloseButton>
    </StyledCard>
  );
}

export default Card;