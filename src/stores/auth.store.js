'use-strict';

import { reactive, toRefs } from "vue";

const baseUrl = `${import.meta.env.VITE_API_URL}/users`;

const state = reactive({
    access_token: null
});

export default function useTokens() {
    const fetchTokens = async () => {
        state.access_token = localStorage.getItem("neotoma_orcid") || {}
    }

    const logoutTokens = async () => {
        state.access_token = null;
        localStorage.removeItem('neotoma_orcid')
    } 

    return {
        ...toRefs(state), // convert to refs when returning
        fetchTokens,
        logoutTokens
    }
}