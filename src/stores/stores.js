import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)
  const doubleCount = computed(() => count.value * 2)
  function increment() {
    count.value++
  }

  return { count, doubleCount, increment }
})

export const useORCIDStore = defineStore("orcid", () => {

  let orcidId = ref(null)

  const callOrcid = computed(() => {
    orcidId.value = $cookies.get('orcidId');
    return orcidId;
  });

  const logOut = computed(() =>{
    orcidId.value = null
    $cookies.remove("orcidId")
    return orcidId;
  });
  return { callOrcid, logOut }
});