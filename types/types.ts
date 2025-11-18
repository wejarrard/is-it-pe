export enum OwnershipType {
    PE_OWNED = 'Private Equity Owned',
    PUBLIC_CHAIN = 'Publicly Traded / Chain',
    FAMILY_PRIVATE = 'Family Owned / Private',
    GOVERNMENT = 'Government Owned',
    NON_PROFIT = 'Non-Profit',
    UNCLEAR = 'Unclear'
  }
  
  export interface SearchSource {
    uri: string;
    title: string;
  }
  
  export interface OwnershipResult {
    companyName: string;
    category: OwnershipType;
    explanation: string;
    sources: SearchSource[];
  }
  
  export interface SearchState {
    isLoading: boolean;
    result: OwnershipResult | null;
    error: string | null;
  }