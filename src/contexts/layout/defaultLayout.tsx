import React, { useEffect } from 'react';
import { ACTIONS } from './enums';
import { useLayout } from '@/hooks';

const min = (a: number, b: number) => (a < b ? a : b);
const max = (a: number, b: number) => (a > b ? a : b);

const SIDEBAR_WIDTH = 78;
const MAX_PANEL_WIDTH = SIDEBAR_WIDTH * 4;
const MIN_PANEL_WIDTH = SIDEBAR_WIDTH * 3;
const PANEL_WIDTH_PERCENTAGE = 0.2;
const TOPBAR_HEIGHT_PERCENTAGE = 0.1;

const isMobile = (width: number) => width < 480;

const DefaultLayoutEngine: React.FC = () => {
  const { layout: state, dispatch } = useLayout();

  useEffect(() => {
    const calcBounds = () => {
      const width = window.document.documentElement.clientWidth;
      const height = window.document.documentElement.clientHeight;
      const mobile = isMobile(width);

      const sidebarWidth = SIDEBAR_WIDTH;
      const panelWidth = state.input.isPanelOpen
        ? mobile
          ? width - sidebarWidth
          : min(max(PANEL_WIDTH_PERCENTAGE * width, MIN_PANEL_WIDTH), MAX_PANEL_WIDTH)
        : 0;
      const mainWidth = width - sidebarWidth - panelWidth;
      const topbarWidth = mainWidth;

      const sidebarHeight = height;
      const panelHeight = state.input.isPanelOpen ? height : 0;
      const topbarHeight = TOPBAR_HEIGHT_PERCENTAGE * height;
      const mainHeight = height - topbarHeight;

      dispatch({
        type: ACTIONS.SET_MAIN,
        value: {
          height: mainHeight,
          left: sidebarWidth + panelWidth,
          top: topbarHeight,
          width: mainWidth,
        },
      });

      dispatch({
        type: ACTIONS.SET_PANEL,
        value: {
          height: panelHeight,
          left: sidebarWidth,
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
          left: sidebarWidth + panelWidth,
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
  }, [dispatch, state.input.isPanelOpen]);

  return null;
};

export default DefaultLayoutEngine;
