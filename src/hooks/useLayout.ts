import { useContext } from 'react';
import LayoutContext from '@/contexts/layout/context';

export const useLayout = () => useContext(LayoutContext);
