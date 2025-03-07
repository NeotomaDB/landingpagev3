<script setup>
import { ref,onMounted} from 'vue';
import {useRoute} from 'vue-router'
import ProgressSpinner from 'primevue/progressspinner';
import Dialog from 'primevue/dialog';
import Panel from 'primevue/panel';
import Tree from 'primevue/tree';
const route = useRoute()
const neotomaapi = import.meta.env.VITE_APP_API_ENDPOINT ?? 'https://api.neotomadb.org'
const alltaxa = ref(null);
const high1 = ref(null);
const high2 = ref(null);
const high3 = ref(null);
const taxon = ref(null);
const taxname = ref(null);
const adelphi = ref([]);
const adelphi1 = ref([]);
const adelphi2 = ref([]);
const allbros = ref(null);
const nestedtree = ref(null);


function sortTreeByChildrenCount(nodes) {
    if (!Array.isArray(nodes)) return [];

    // Sort nodes by their number of children (ascending order)
    nodes.sort((a, b) => (a.children?.length || 0) - (b.children?.length || 0));

    // Recursively sort children of each node
    nodes.forEach(node => {
        if (node.children) {
            node.children = sortTreeByChildrenCount(node.children);
        }
    });

    return nodes;
}
function loadTree() {
  return fetch(neotomaapi + "/v2.0/data/dbtables/taxa?count=false&limit=999999&offset=0",
  { method: "GET", headers: {'content-type': 'application/json'} })
  .then(res1 => {
     return res1.json() })
  .then(json1 => {
    alltaxa.value = json1.data;
    taxon.value = alltaxa.value.find(obj => obj.taxonid == route.params.taxonid);
    taxname.value = taxon.value.taxonname;
    high1.value = alltaxa.value.find(obj => obj.taxonid == taxon.value.highertaxonid);
    high2.value = alltaxa.value.find(obj => obj.taxonid == high1.value.highertaxonid);
    high3.value = alltaxa.value.find(obj => obj.taxonid == high2.value.highertaxonid);
    adelphi.value = alltaxa.value.filter(obj => obj.highertaxonid == taxon.value.highertaxonid);
    adelphi1.value = alltaxa.value.filter(obj => obj.highertaxonid == high1.value.highertaxonid);
    adelphi2.value = alltaxa.value.filter(obj => obj.highertaxonid == high2.value.highertaxonid);
    allbros.value = adelphi.value.concat(adelphi1.value,adelphi2.value,high3.value)
    console.log(allbros.value)

  })
}


function onNodeSelect() {

}

function buildTree() {
  let map = new Map();
  allbros.value.forEach(item => {
    map.set(item.taxonid, {
      label: item.taxonname,
      data: "https://data.neotomadb.org/taxa/" + item.taxonid,
      children: []
    });
  });

  let tree = [];

  allbros.value.forEach(item => {
    if (map.has(item.highertaxonid)) {
        map.get(item.highertaxonid).children.push(map.get(item.taxonid));

    } else {
      tree.push(map.get(item.taxonid));
    }
  });

  nestedtree.value = sortTreeByChildrenCount(tree);
  console.log(nestedtree.value);
}


onMounted(async () => {
    await loadTree();
    await buildTree();
})

</script>

<template>
  <Panel>
    <template #header>
      <h2>{{taxname}} Taxonomic Tree</h2>
    </template>
<Tree :value="nestedtree" @nodeSelect="onNodeSelect" class="w-full md:w-[30rem]">

  <template #default="slotProps">
        <a :href="slotProps.node.data">{{ slotProps.node.label }}</a>
    </template>
</Tree>
</Panel>
 </template>

