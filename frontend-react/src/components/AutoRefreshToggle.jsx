import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const ToggleContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 5px; /* Уменьшено расстояние */
  background-color: ${({ theme }) => theme.colors.backgroundLight};
  border-radius: ${({ theme }) => theme.borderRadius.small}; /* Уменьшен радиус */
  padding: 4px 8px; /* Уменьшен padding */
  box-shadow: ${({ theme }) => theme.boxShadow.small};
`;

const ToggleSwitch = styled.label`
  position: relative;
  display: inline-block;
  width: 30px; /* Уменьшен размер переключателя */
  height: 18px; /* Уменьшен размер переключателя */
`;

const ToggleInput = styled.input`
  opacity: 0;
  width: 0;
  height: 0;

  &:checked + span {
    background-color: ${({ theme }) => theme.colors.primary};
  }

  &:focus + span {
    box-shadow: 0 0 1px ${({ theme }) => theme.colors.primary};
  }

  &:checked + span:before {
    transform: translateX(12px); /* Смещение ползунка */
  }
`;

const ToggleSlider = styled.span`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${({ theme }) => theme.colors.grayLight};
  transition: .4s;
  border-radius: 24px;

  &:before {
    position: absolute;
    content: "";
    height: 12px; /* Уменьшен размер ползунка */
    width: 12px; /* Уменьшен размер ползунка */
    left: 3px; /* Смещение ползунка */
    bottom: 3px; /* Смещение ползунка */
    background-color: white;
    transition: .4s;
    border-radius: 50%;
  }
`;

const TimerText = styled.span`
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.85em; /* Уменьшен размер шрифта */
  min-width: 60px; /* Уменьшен min-width */
  text-align: right;
`;

function AutoRefreshToggle({ autoRefreshEnabled, setAutoRefreshEnabled, refreshInterval, onRefresh }) {
  const [countdown, setCountdown] = useState(refreshInterval / 1000);
  const intervalSeconds = refreshInterval / 1000;

  useEffect(() => {
    let timer;
    if (autoRefreshEnabled) {
      setCountdown(intervalSeconds); // Сброс таймера при включении
      timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            // Если таймер дошел до 0, сбрасываем его и вызываем onRefresh
            if (onRefresh) {
              onRefresh();
            }
            return intervalSeconds; // Сброс до начального значения
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      setCountdown(intervalSeconds); // Сброс таймера при выключении
    }

    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [autoRefreshEnabled, refreshInterval, onRefresh, intervalSeconds]);

  const handleToggle = () => {
    setAutoRefreshEnabled(prev => !prev);
  };

  return (
    <ToggleContainer>
      <ToggleSwitch>
        <ToggleInput type="checkbox" checked={autoRefreshEnabled} onChange={handleToggle} />
        <ToggleSlider />
      </ToggleSwitch>
      <TimerText>
        {autoRefreshEnabled ? `${countdown}с` : 'Выкл'}
      </TimerText>
    </ToggleContainer>
  );
}

export default AutoRefreshToggle;