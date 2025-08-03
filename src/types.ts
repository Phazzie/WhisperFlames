// Core SDD types
export interface Seam {
  name: string;
  type: string;
  description: string;
  ioHints: {
    inputs: string[];
    outputs: string[];
  };
}

export interface Contract {
  name: string;
  version: string;
  versionDate: string;
  owner: string;
  description: string;
  inputs: Record<string, any>;
  outputs: Record<string, any>;
  errors: Record<string, any>;
  examples: Array<{
    in: Record<string, any>;
    out: Record<string, any>;
  }>;
}

export interface PRDCache {
  content: string;
  timestamp: string;
  seams?: Seam[];
  contracts?: string[];
}

export interface APIResponse<T = any> {
  ok: boolean;
  data?: T;
  errors?: string[];
}
