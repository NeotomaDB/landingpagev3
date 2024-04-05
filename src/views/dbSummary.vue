<script setup>
import {ref, onMounted} from 'vue';
import Panel from 'primevue/panel'
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
const databasekeys = ref(null);
const visible = ref(false);
const contact = ref(0)
const contactinfo = ref(0)
const uniqueSites = ref(null);
const loading_ab = ref(true);
const databasename = ref(null)
const currentDB = ref(null)
const uniqueDBsites = ref(null);
const uniqueDBsets = ref(null);
const datasettypes = ref(null);
const thisOneActive = ref(null);
const textDB = ref(null);
const dbkey2 = ref(null);
const htmlString = ref(null);
const neotomaapi = import.meta.env.VITE_APP_API_ENDPOINT ?? 'https://api.neotomadb.org'


const textobj = [
  {dbID: 3, dbDescrip: `<a href='https://apps.neotomadb.org/explorer/?search=%7B%22metadata%22:%7B%22databaseId%22:3%7D%7D' target='_blank'>
    The European Pollen Database (EPD)</a> was founded 1989 and established in 1990 in Arles, France with Rachid Cheddadi as its first curator. In 2007 the database moved to IMEP (Institut Méditerranéen d'Ecologie et de Paléoécologie) 
    in Aix en Provence, which together with Aix-Marseille University fund the current database manager Michelle Leydet. 
    In May 2007 the EPD organized its first open science meeting that lead to a change in governance with currently a chair and vice chair supported by active data stewards. 
    Participants of the 2016 open EPD meeting in Aix en Provence supported the initiative of the EPD to become a constituent database of Neotoma. 
    Data migration was initiated in 2017 and finalized in 2022. 
    The EPD is curated by an active community of data stewards, striving to maintain an open governance structure 
    and fostering exchange of knowledge though open science meetings.</p> 
    <p>See this webpage for further information: https://epdweblog.org/.</p> 
    <p>If using data from the European Pollen Database, please see the preferred citations on the 
      <a href='https://www.neotomadb.org/data/data-use-and-embargo-policy' target='_blank'>Data Use</a> page.<p>
<a target='_blank' href='https://apps.neotomadb.org/explorer/?search=%7B%22metadata%22:%7B%22databaseId%22:3%7D%7D'>View EPD sites in Neotoma Explorer.</a>` },
{dbID: 5, dbDescrip: `<p>The Latin American Pollen Database (LAPD) was founded in 1994 by Vera Markgraf at the University of Colorado (USA). 
  During the period between 1998 and 2003, management of the LAPD was based at the University of Amsterdam, 
  where Robert Marchant served as coordinator and additional support was provided by Juan Carlos Berrío. 
  In 2009, the LAPD site inventory was updated again by Suzette Flantua and published in Review of Palaeobotany
  and Palynology (Flantua et al. 2015 RPP) and made available on the LAPD website. 
  The raw pollen datasets of the LAPD are now in Neotoma as a constituent database.</p>
<p>For more information: https://www.latinamericapollendb.com/</p>`},
{dbID: 6, dbDescrip: `The North American Pollen Database (NAPD) was launched in 1990 by Eric Grimm at 
  the Illinois State Museum, and drew heavily on precursor efforts by Tom Webb and others at Brown University
   to gather, organize, and map pollen data for the COHMAP and earlier projects. The NAPD was then incorporated 
   into the Global Pollen Database and was served from NOAA's Paleoclimatology World Data Service, 
   before becoming one of the founding constituent databases of Neotoma.`},
{dbID: 10, dbDescrip: `<p>The FAUNMAP database was originally created by Russ Graham and Ernie Lundelius,
   and hosted by the Illinois State Museum. You can read more about it here: https://www.museum.state.il.us/research/faunmap/aboutfaunmap.html </p>
<p>It was one of the original contributing constituent databases when the Neotoma Paleoecology Database formed in 2009. 
The version in Neotoma is a living database, so new sites are added and existing sites are updated as warranted.</p>
<p><i>Note: Some original FAUNMAP datasets contain data on human Ancestors. We have removed these data while we 
  develop a constituent database policy on the use and presentation of sensitive data (as of July 10, 2023).
   No other modifications will be made to the site files and the original site files have been saved in Tilia format. 
   This change has affected 392 datasets within FAUNMAP. Please contact FAUNMAP lead steward 
   <a href='https://www.neotomadb.org/people/jessica-blois' target='_blank'>Jessica Blois</a> 
   if you wish to view or access the original full site data.</i></p>`},
{dbID: 13, dbDescrip: `The Academy of Natural Sciences of Drexel University (ANSDU) constituent diatom database was established in 2010 
  with funding from a 2009 National Science Foundation grant to establish Neotoma. 
  It continued work assembling data that had been ongoing as part of the Diatom Paleoecology Data Cooperative, 
  funded by NOAA and NSF from 1994- 2008. The ANSDU database extends data from sites that were initially in the DPDC, 
  and adds many additional new sites and datasets. It contains primarily diatom count data for lake surface samples and sediment cores. 
  ANSDU data are contained entirely within Neotoma. There is no separate database or website, though there is a directory at 
  Drexel University with contributed data files and supporting materials.` },
{dbID: 30, dbDescrip: `<p>The main types of data included in the DPDC are site information, diatom counts, water chemistry and other environmental data,
   and chronologies. The DPDC was initially funded by NOAA and NSF from 1994 - 2008, with continued support to facilitate transfer to Neotoma coming from NSF. 
   For more information and history, see the <a href='https://diatom.ansp.org/dpdc/Information.aspx' target='_blank'>DPDC website</a>. 
   Data that were originally included in the DPDC via the linked website have not been accessible to retrieve since 2021, 
   thus the DPDC constituent database within Neotoma is the primary source of data currently.</p>
<p>Data downloaded from this constituent database should be cited, as well as the original source publications and investigators whenever possible. 
Please use the following as an example: 'Data were obtained from the Diatom Paleolimnology Data Cooperative (https://diatom.ansp.org/dpdc/), a constituent database of the Neotoma Paleoecology Database 
(https://www.neotomadb.org/). The work of data contributors, data stewards, and the Neotoma and DPDC communities is gratefully acknowledged.'</p>
<p>For more information, see the DPDC website https://diatom.ansp.org/dpdc/Information.aspx.</p>`},
{dbID: 28, dbDescrip: `<p>The Alpine Palynological Database (ALPADABA) was founded 1990 and established in 1991 at University of Bern, Switzerland with Brigitta Ammann. The first curator was Pim (W.O.)
   van der Knaap. In 1992 the database already covered ca. 30 sites with 50 palynological records. From the beginning, 
   ALPADABA was coordinated with the European Pollen Database (EPD), e.g. in regard to data entry forms and taxonomy. 
   Several taxonomy meetings were organized with EPD to coordinate the typological denominations. 
   The chair of ALPADABA is the head of the palaeoecology section at University of Bern, the curator is appointed among experienced 
   palynologists of the research section. Being in exchange with EPD, ALPADABA served as database for several scientific publications
    at the Alpine and European scale. In 2020 ALPADABA became a constituent database of Neotoma. 
    Data migration was initiated in 2020 and is ongoing.</p>
<p>If using data from ALPADABA, please see the preferred citations on the <a href='https://www.neotomadb.org/data/data-use-and-embargo-policy' target='_blank'>Data Use</a> page.</p>
<a target='_blank' href='https://apps.neotomadb.org/explorer/?search=%7B%22metadata%22:%7B%22databaseId%22:28%7D%7D'>View ALPADABA sites in Neotoma Explorer.<a>` },
{dbID: 2, dbDescrip: `<p>The APD was first developed in 1996. The initial workshop and subsequent work, funded by the French CNRS, the EU (INCO, ENRICH) and UNESCO 
  (PICG), established methods of collating pollen data, developed a standardized pollen nomenclature (Vincens et al. 2007), 
  generated updated age models, collated images of pollen grains, and created a searchable web interface. 
  Due to a lack of funding and the closure of the French data center, Medias-France, the APD lapsed in 2007, 
  making its extant data holdings largely inaccessible and leaving no home for newer paleoecological records. 
  It has recently been revived and various contributors are actively adding data to the database.</p>
<p>If using data from the African Pollen Database, please see the preferred citations on the <a href='https://www.neotomadb.org/data/data-use-and-embargo-policy' target='_blank'>Data Use</a> page.</p>
<p>For more information: https://africanpollendatabase.ipsl.fr</p>
<a href='https://apps.neotomadb.org/explorer/?search=%7B%22metadata%22:%7B%22databaseId%22:2%7D%7D' target='_blank'>View APD sites in Neotoma Explorer</a>`}]

console.log(textobj)
function loadDatabases() {
    return  fetch(neotomaapi + "/v2.0/data/dbtables/constituentdatabases?count=false&limit=5000&offset=0",
      { method: "GET", headers: {'content-type': 'application/json'}})
    .then(res1 => {
      return res1.json()})
    .then(json1 => {
      databasekeys.value = json1.data  
  //    const lengths = fetch(neotomaapi + "/v2.0/apps/constdb/datasets?dbid=" + databasekeys.)
     // currentDB.value = databasekeys.value.find(element => element.databaseid === Number(route.params.databaseid))
         
    //  databasename.value = currentDB.value.databasename
      return databasekeys.value
    })
    //.then(keys => {
     //   deluxe.value = keys.map(obj => ({...obj, length: fetch(neotomaapi + "/v2.0/apps/constdb/datasets?dbid=" + obj.databaseid).json().data.length}))
    //})

    }


  async function loadContact(contactid) {
  return await fetch(neotomaapi + "/v1.5/data/contacts/" +contactid,
  { method: "GET", headers: {'content-type': 'application/json'}})
  .then(async res => {
    if (!res.ok) {
      const error = new Error(res.statusText)
      error.json = {'error': res.json(), 'databaseid':route.params.databaseid}
      throw error;}
    return await res.json()})
  .then(async json => {
    contactinfo.value = await json.data  
    return contactinfo.value})}



async function loadSumSites(id) {
      console.log(textobj.filter(a => a.dbID == id.databaseid).length == 0)
      console.log(textobj.filter(a => a.dbID == id.databaseid))
      if (textobj.filter(a => a.dbID == id.databaseid).length != 0) {
      let texttry = textobj.filter(a => a.dbID == id.databaseid)[0].dbDescrip
      textDB.value = texttry}
      else {
        textDB.value = ""
      }
      htmlString.value = textDB.value
      let itsall = await fetch(neotomaapi + "/v2.0/apps/constdb/datasets?dbid=" + id.databaseid)
      if (id.contactid) {
        let con = await fetch(neotomaapi + "/v1.5/data/contacts/" +id.contactid)
        con = await con.json();
        con = await con.data;
        contact.value = con.flatMap(con => con.contactname);
        contact.value = contact.value[0]}
      else {
        contact.value = "No Contact"
      }

      itsall = await itsall.json()
      itsall = await itsall.data
      let uniques = new Set()
      itsall.forEach(obj => uniques.add(obj['siteid']));
      uniques = uniques.size
      console.log(id.databaseid)
      uniqueSites.value = uniques
      uniqueDBsets.value = new Set();
      itsall.forEach(obj => uniqueDBsets.value.add(obj['datasetid']));
      uniqueDBsets.value = uniqueDBsets.value.size
      datasettypes.value = itsall.reduce((acc, obj) => {
          const type = obj.datasettype;
          acc[type] = (acc[type] || 0) + 1;
          return acc;}, {});

      datasettypes.value = Object.entries(datasettypes.value).map(([datasettype,value]) => ({datasettype,value}));
      thisOneActive.value = id.databaseid
      thisOneActive.value = id.databaseid
}




function collapser(id) {
  if (id == thisOneActive.value) {
    return false
  }

  if (id != thisOneActive.value) {
    return true
  }

}


onMounted(async () => {
  
await loadDatabases();
})

</script>

<template>
    <h1>Constituent Databases Landing Pages</h1>
    <p>These are the landing pages for Neotoma's constituent databases. 
      These pages provide database-specific information on dataset types,
    spatial and temporal coverage, upload history, and data contributors.</p>
    <div v-for="(el,index) in databasekeys">
        <Panel @click="loadSumSites(el)" toggleable :collapsed=collapser(el.databaseid)>
            <template #header>
                <h2><a :href="'database/' + el.databaseid" target="_blank">{{ el.databasename }}</a></h2>
            </template>
            <div>
              <div id="about" v-html="htmlString">
            </div>
            <p>Database Contact: {{ contact }}</p>
            <p>{{el.databasename}} currently contains {{uniqueSites}} unique sites, associated with {{ uniqueDBsets }}
          unique datasets. See below for a summary of the kinds of datasets {{ el.databasename }} contains. </p>

    
           <DataTable paginator :rows="5" :value="datasettypes" :sort-field="'value'" :sort-order="-1" tableStyle="min-width: 20rem">
           <Column field="datasettype" header="Dataset Type"></Column>
           <Column field="value" header="Number" sortable></Column>
         </DataTable>
            </div>

    </Panel>
    </div>
  

</template>