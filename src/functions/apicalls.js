import VueCookies from 'vue-cookies';
import useTokens from '@/stores/auth.store';

const apiBase = import.meta.env.VITE_APP_API_ENDPOINT || 'https://api.neotomadb.org';

/**
 * authedFetch
 * - Builds a full URL from a path or passes through an absolute URL.
 * - Pulls the session UUID out of the orcid_user cookie (if present).
 * - Adds the Authorization header automatically.
 * - Returns the same Response object as native fetch — caller decides what to do.
 */
export async function authedFetch(path, options = {}) {
  const url = path.startsWith('http') ? path : `${apiBase}${path}`;
  const orcidUser = VueCookies.get('orcid_user');
  const sessionuuid = orcidUser?.data?.neotoken?.sessionuuid;

  const headers = {
    ...(options.headers || {}),
    ...(sessionuuid ? { Authorization: `Bearer ${sessionuuid}` } : {}),
  };

  return fetch(url, { ...options, headers });
}

/**
 * authedFetchJson — convenience for when we want JSON back.
 */
export async function authedFetchJson(path, options = {}) {
  const res = await authedFetch(path, options);
  if (res.status === 401) {
    const { logoutTokens } = useTokens();
    await logoutTokens();
    throw new Error('Session expired — please log in again');
  }
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`API ${res.status}: ${body}`);
  }
  return res.json();
}
