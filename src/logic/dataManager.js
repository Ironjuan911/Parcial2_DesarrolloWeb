import storageLE from '../services/storageLE.js';

export default class dataManager {
    constructor() {
        this.storageLE = new storageLE('credentials');

    }

    async waitForUsers(timeout = 6000) {
        const start = Date.now();
        while (!this.users || this.users.length === 0) {
            if (Date.now() - start > timeout) {
                throw new Error('Timeout esperando usuarios');
            }
            await new Promise(resolve => setTimeout(resolve, 100)); // espera 100ms
        }
        return true;
    }

    async canBuy() {
        await this.waitForUsers();
        return this.users.length > 0;
    }

    async loadUsers() {
        this.users = [];
        this.users = await this.storageLE.getAll();
    }

    async buygame(appid) {
        if (!localStorage.getItem('user')) { // Verifica si hay un usuario logueado
            throw new Error('No hay un usuario logueado');
        }

        let user = JSON.parse(localStorage.getItem('user'));
        let library = JSON.parse(user.library || '[]');

        for (let game of library) {
            game = String(game);
            appid = String(appid);
            if (game === appid) {
                throw new Error('El juego ya está en la librería');
            }
        }

        library.push(appid);
        user.library = JSON.stringify(library);
        localStorage.setItem('user', JSON.stringify(user));

        let index;

        for (const usr of this.users) {
            if (usr.id === user.id) {
                index = usr._index;
                break;
            }
        }

        this.storageLE.updateData(index, user);


        



    }
    closeSession() {
        localStorage.removeItem('user');
    }

    setDefaultCredentials() {
        localStorage.removeItem('usuarioLogueado');

        localStorage.removeItem('usuarios');

    }
}