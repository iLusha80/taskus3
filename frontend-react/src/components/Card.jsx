import React from 'react';
import styled from 'styled-components';
import { FaTrashAlt } from 'react-icons/fa'; // Import delete icon

const StyledCard = styled.div`
  background-color: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.grayLight};
  border-radius: ${({ theme }) => theme.borderRadius.large}; /* Use large border radius */
  padding: ${({ theme }) => theme.spacing.medium};
  margin-bottom: ${({ theme }) => theme.spacing.small};
  box-shadow: ${({ theme }) => theme.boxShadow.medium}; /* Use medium shadow */
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  cursor: grab;

  &:hover {
    transform: translateY(-5px);
    box-shadow: ${({ theme }) => theme.boxShadow.large}; /* Use large shadow on hover */
  }
`;

const CardTitle = styled.h4`
  margin-top: 0;
  margin-bottom: ${({ theme }) => theme.spacing.small};
  font-size: ${({ theme }) => theme.typography.body.fontSize}; /* Use body font size for title */
  color: ${({ theme }) => theme.colors.text}; /* Use primary text color */
  font-weight: ${({ theme }) => theme.typography.heading3.fontWeight}; /* Use heading3 weight */
`;

const CardDescription = styled.p`
  font-size: ${({ theme }) => theme.typography.small.fontSize}; /* Use small font size */
  color: ${({ theme }) => theme.typography.small.color}; /* Use small text color */
  line-height: ${({ theme }) => theme.typography.body.lineHeight};
  margin-bottom: ${({ theme }) => theme.spacing.small};
`;

const CardActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing.small};
  margin-top: ${({ theme }) => theme.spacing.small};
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

const DeleteButton = styled(ActionButton)`
  color: ${({ theme }) => theme.colors.danger}; /* Use danger color for delete button */

  &:hover {
    color: ${({ theme }) => theme.colors.danger}; /* Keep danger color on hover for clarity */
    opacity: 0.8; /* Add slight opacity change on hover */
  }
`;


function Card({ card, onDelete }) {
  const { id, title, description } = card;

  return (
    <StyledCard>
      <CardTitle>{title}</CardTitle>
      {description && <CardDescription>{description}</CardDescription>}
      <CardActions>
        {/* Edit button can be added here later */}
        <DeleteButton onClick={() => onDelete(id)}>
          <FaTrashAlt /> {/* Use react-icons component */}
        </DeleteButton>
      </CardActions>
    </StyledCard>
  );
}

export default Card;