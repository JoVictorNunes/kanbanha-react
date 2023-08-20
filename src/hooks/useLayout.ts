import { useContext } from 'react';
import LayoutContext from '@/contexts/layout/contex';

export const useLayout = () => useContext(LayoutContext);
