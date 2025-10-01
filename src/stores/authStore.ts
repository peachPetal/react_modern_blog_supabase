import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import type { Claims } from "../types/user";
import type { Profile } from "../types/profile";
import supabase from "../utils/supabase";
// import Profile from "../pages/profile/Profile";

type AuthStore = {
    isLoading? : boolean;
    claims?: Claims;
    profile?: Profile | null;
    setProfile: (profile: Profile | null) => void;
    setClaims?: (c: Claims) => void;
    hydrateFromAuth?: () => void;
    clearAuth?: () => void;
};

export const useAuthStore = create<AuthStore>()(
    devtools(
        persist(
            immer((set) => ({
                isLoading: true,
                claims: null,
                profile: null,
                setProfile: (profile: Profile | null) => {
                    set((state) => {
                        state.profile = profile;
                    })
                },
                setClaims: (c: Claims) => {
                    set((state) => {
                        state.claims = c;
                    })
                },
                hydrateFromAuth: async () => {
                    set({isLoading: true});
                    // (1) 클레임 가져오기
                    const { data, error } = await supabase.auth.getClaims();
                    if (error){
                        set({claims: null, profile: null, isLoading: false});
                        return;
                    }
                    const claims = data?.claims as Claims | null;
                    set({claims: claims});

                    //(2) 프로필 조회
                    if(claims?.sub){
                        const { data: profiles, error: profilesError } = await supabase
                        .from("profiles")
                        .select("*")
                        .eq("id", claims.sub)
                        .single();

                        if (profilesError){
                            set({claims: null, profile: null, isLoading: false});
                        }

                        set({profile: profiles ?? null});
                    }
                },
                clearAuth: () => {
                    set((state) => {
                        state.claims = null;
                        state.profile = null;
                    })
                },
            })), 
            {name: "auth-store"}
        )
    )
);