class SendMessage {

    adminsWs = []
    usersWs = []

    async sendMessage(ws, message){
        return ws.send(JSON.stringify(message))
    }

    async sendUsers(message){
        this.usersWs.forEach(aw=>this.sendMessage(aw.ws, message))
    }

    async sendAdmins(message){
        this.adminsWs.forEach(aw=>this.sendMessage(aw.ws, message))
    }

    async sendAll(message){
        this.sendAdmins(message)
        this.sendUsers(message)
    }

    async sendTime(time){
        this.sendAll({action:'time', time})
    }
}

module.exports = new SendMessage()