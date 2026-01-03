import { type StateCreator } from 'zustand';

import type { AgentsSlice, AllSlices } from './types';


export const createAgentsSlice: StateCreator<
  AllSlices,
  [],
  [],
  AgentsSlice
> = (set) => ({
  agents: {},
  addAgent: () => {}
});