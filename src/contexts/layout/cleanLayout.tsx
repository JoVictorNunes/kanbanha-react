import React, { useEffect } from 'react';
import { ACTIONS } from './enums';
import { useLayout } from '@/hooks';

const TOPBAR_HEIGHT_PERCENTAGE = 0.1;

const CleanLayoutEngine: React.FC = () => {
  const { dispatch } = useLayout();

  useEffect(() => {
    const calcBounds = () => {
      const width = window.document.documentElement.clientWidth;
      const height = window.document.documentElement.clientHeight;

      const sidebarWidth = 0;
      const panelWidth = 0;
      const mainWidth = width;
      const topbarWidth = width;

      const sidebarHeight = 0;
      const panelHeight = 0;
      const topbarHeight = TOPBAR_HEIGHT_PERCENTAGE * height;
      const mainHeight = height - topbarHeight;

      dispatch({
        type: ACTIONS.SET_MAIN,
        value: {
          height: mainHeight,
          left: 0,
          top: topbarHeight,
          width: mainWidth,
        },
      });

      dispatch({
        type: ACTIONS.SET_PANEL,
        value: {
          height: panelHeight,
          left: 0,
          top: 0,
          width: panelWidth,
        },
      });

      dispatch({
        type: ACTIONS.SET_SIDEBAR,
        value: {
          height: sidebarHeight,
          left: 0,
          top: 0,
          width: sidebarWidth,
        },
      });

      dispatch({
        type: ACTIONS.SET_TOPBAR,
        value: {
          height: topbarHeight,
          left: 0,
          top: 0,
          width: topbarWidth,
        },
      });
    };
    calcBounds();
    const onResize = () => {
      calcBounds();
    };
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, [dispatch]);

  return null;
};

export default CleanLayoutEngine;
