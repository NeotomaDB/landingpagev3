import { defineStore } from 'pinia';
import {ref} from 'vue';

const baseUrl = `${import.meta.env.VITE_API_URL}/users`;

export const orcid_store = defineStore('orcid-user', () => {
    const name = ref(null);
    const access_token = ref(null);
    const token_type = ref(null);
    const expires_in = ref(null);
    const tokenVersion = ref(null);
    const persistent = ref(null);
    const id_token = ref(null);
    function validate() {
        fetch('POST', )
    };
    function logout() {

    }
})