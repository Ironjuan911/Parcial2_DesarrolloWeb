const urlProxy0 = 'https://api.allorigins.win/get?url=';

const urlProxy1 = 'https://vercel-proxy-two-beta.vercel.app/api/proxy?url=';

export default class steamDataBase {
    async importarJuego(appId) {
        if (!appId) {
            console.error("Error: Se requiere un AppID.");
            return null;
        }


        console.log(`Consultando API para AppID: ${appId}`);

        try {
            return this.importarJuegoP(appId, urlProxy1, "Vercel");
        } catch (error) {
            return this.importarJuegoP(appId, urlProxy0, "AllOrigins");
        }


    }



    async importarJuegoP(appId, urlProxy, text) {
        const urlSteam = `https://store.steampowered.com/api/appdetails?appids=${appId}&cc=us&l=es`;
        let url = urlProxy + urlSteam;


        const respuesta = await fetch(url);

        if (!respuesta.ok) {

            console.error(`Error de solicitud HTTP: ${respuesta.status} ${respuesta.statusText}`);
            throw new Error(`HTTP error! status: ${respuesta.status}`);
        }

        const datosJSON = await respuesta.json();


        const resultado = datosJSON[appId];

        if (resultado && resultado.success) {

            console.log(`Datos del juego ${appId} importados con éxito. (${text})`);
            return resultado.data;
        } else {

            console.error(`La API de Steam no devolvió datos exitosos para el AppID ${appId}.`);
            return null;
        }


    }

    async importLibrary(appId) {
        if (!appId) {
            console.error("Error: Se requiere un AppID.");
            return null;
        }


        console.log(`Consultando API para AppID: ${appId}`);

        try {
            return this.importLibraryP(appId, "", "No Proxy");
        } catch (error) {
            return this.importLibraryP(appId, urlProxy1, "Vercel");
        }


    }

    async importLibraryP(appId, urlProxy) {
        const urlSteamDB = 'https://shared.fastly.steamstatic.com/'
        const toImport = [
            {type:"library_600x900.jpg",name:"library_600x900", key:"store_item_assets/steam/apps/"},
            {type:"library_hero.jpg",name:"library_hero",key:"store_item_assets/steam/apps/"},
            {type:"logo.png",name:"logo",key:"store_item_assets/steam/apps/"},
        ]
        
        const base = (urlProxy ? urlProxy : '') + urlSteamDB;
        // objeto resultado con llaves dinámicas
        const obj = { appId: appId };

        for (let i = 0; i < toImport.length; i++) {
            const item = toImport[i];
            const imgUrl = base + item.key + appId + "/" + item.type;
            try {
                // Intentar HEAD primero (más ligero); si falla, intentar GET
                let res = await fetch(imgUrl, { method: 'HEAD' });
                if (!res.ok) {
                    res = await fetch(imgUrl); // fallback a GET
                }
                if (res.ok) {
                    // asignación dinámica de la propiedad con el nombre indicado
                    obj[item.name] = imgUrl;
                } else {
                    obj[item.name] = '';
                    console.error(`Imagen no encontrada ${imgUrl}: ${res.status} ${res.statusText}`);
                }
            } catch (err) {
                obj[item.name] = '';
                console.error(`Error al obtener ${imgUrl}:`, err);
            }
        }
        console.log(`Datos de la librería del juego ${appId} importados con éxito.`);
        // devolver un array con el objeto para que coincida con la estructura solicitada
        return obj;
    }



}