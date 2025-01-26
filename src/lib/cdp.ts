import { Coinbase } from "@coinbase/coinbase-sdk";

export const cdpConfig = Coinbase.configure({
  apiKeyName: import.meta.env.VITE_CDP_API_KEY,
  privateKey: import.meta.env.VITE_CDP_API_SECRET
});