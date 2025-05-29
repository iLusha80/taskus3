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
  position: relative; /* Added for positioning the close button */

  &:hover {
    transform: translateY(-5px);
    box-shadow: ${({ theme }) => theme.boxShadow.large}; /* Use large shadow on hover */
  }
`;

const CardTitle = styled.h4`
  margin-top: 0;
  margin-bottom: ${({ theme }) => theme.spacing.small};
  font-size: ${({ theme }) => theme.typography.cardTitle.fontSize}; /* Use body font size for title */
  color: ${({ theme }) => theme.colors.text}; /* Use primary text color */
  font-weight: ${({ theme }) => theme.typography.heading3.fontWeight}; /* Use heading3 weight */
  padding-bottom: ${({ theme }) => theme.spacing.xsmall}; /* Добавляем отступ снизу для линии */
  border-bottom: 1px solid ${({ theme }) => theme.colors.grayLight}; /* Тонкая линия */
`;

const CardDescription = styled.p`
  font-size: ${({ theme }) => theme.typography.xsmall.fontSize}; /* Use small font size */
  color: ${({ theme }) => theme.typography.small.color}; /* Use small text color */
  line-height: ${({ theme }) => theme.typography.body.lineHeight};
  margin-bottom: ${({ theme }) => theme.spacing.small};
`;

const CloseButton = styled.button`
  position: absolute;
  top: 5px;
  right: 5px;
  background: none;
  border: none;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.grayDark};
  font-size: 1.2em;
  line-height: 1;
  padding: 0;
  transition: color 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.danger};
  }
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.grayDark}; /* Use dark gray for action buttons */
  font-size: 1em; /* Adjust font size for icons */
  transition: color 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.primary}; /* Use primary color on hover */
  }
`;

function Card({ card, onDelete, onEdit }) {
  const { id, title, description } = card;

  return (
    <StyledCard>
      <CloseButton onClick={(e) => { e.stopPropagation(); onDelete(id); }}>
        &times;
      </CloseButton>
      <div onClick={() => onEdit(card)}>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </div>
    </StyledCard>
  );
}

export default Card;