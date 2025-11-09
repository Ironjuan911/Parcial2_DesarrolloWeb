export default class dataManager {
    buygame(appid) {
        const users = JSON.parse(localStorage.getItem('usuarios')) || [];
        if (localStorage.getItem('usuarioLogueado')) {
            const usuario = JSON.parse(localStorage.getItem('usuarioLogueado'));
            if (!usuario.library.includes(appid)) {
                usuario.library.push(appid);

                let userid = usuario.id;
                
                for(let user of users) {
                    if (user.id == userid) {
                        user.library = usuario.library;
                        localStorage.setItem('usuarios', JSON.stringify(users));
                        localStorage.setItem('usuarioLogueado', JSON.stringify(usuario));
                        alert("Juego comprado con exito!");
                        return true;
                    }
                }



            }
        }
        return false;
    }

    closeSession() {
        localStorage.removeItem('usuarioLogueado');
    }

    setDefaultCredentials() {
        localStorage.removeItem('usuarioLogueado');

        localStorage.removeItem('usuarios');

    }
}