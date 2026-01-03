import { create } from 'zustand';

import { type AllSlices } from './types';
import { createAgentsSlice } from './createAgentsSlice';
import { createResourcesSlice } from './createResourcesSlice';

export const useGame = create<AllSlices>((...topLevelArgs) => ({
  ...createAgentsSlice(...topLevelArgs),
  ...createResourcesSlice(...topLevelArgs),
}));
