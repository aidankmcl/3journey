
type Inventory = {
  wood: number;
  stone: number;
  metal: number;
}

type Agent = {
  id: string;
  state: 'idle' | 'moving' | 'farming';
  targetId: string;
  inventory: Inventory;
}

export interface AgentsSlice {
  agents: {
    [id: string]: Agent
  },
  addAgent: () => void
}

export interface ResourcesSlice {
  
}

export interface UISlice {

}

export type AllSlices = AgentsSlice & ResourcesSlice;