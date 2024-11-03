class UserService {

    users = []
    activeUser = null
    user = null

    constructor() {
        
    }

    async getUsers() {
      this.users = await getItem('users');
    }

    async getUser(id) {
       this.user = await getItem(`users/${id}/`);
    } 
}