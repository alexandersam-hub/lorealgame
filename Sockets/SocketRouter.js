const tokenService = require('../Services/ComponentServices/tokenService')
const { v1: userKey} = require('uuid')
const { WebSocketServer } = require('ws');
const GameSocketService = require('./GameSocketService')
const SendMessage = require('./SendMessage')

class SocketRouter{
    ws
    init(server, isDevelop){
        let counterUserLocalId = 1
        try{
            //this.ws = new WebSocketServer({server});
            console.log('start socketServer')

            //
            if (isDevelop)
                this.ws = new WebSocketServer({port:8100});
            else
                this.ws = new WebSocketServer({server});

            this.ws.on('connection', (ws) =>{

                let user = null
                let userLocalId = ++counterUserLocalId
                ws.on('message', async (message)=> {
                    if (!  GameSocketService.isInit)
                        await  GameSocketService.init()
                    const data = JSON.parse(message)
                    // console.log(data.action)
                    switch (data.action) {
                        case 'login':
                            const result =  await GameSocketService.connectUser(ws, data.token, userLocalId)

                            if (result.warning && !result.user)
                                return SendMessage.sendMessage(ws, {action:'login', warning:true, badToken:true})
                            user = result.user
                            return SendMessage.sendMessage(ws, {...result, action:'login'})

                        case 'start':
                            GameSocketService.startGame()
                            break
                        case 'stopGame':
                            GameSocketService.stopGame()
                            break
                        case 'refreshGame':
                            GameSocketService.refreshGame()
                            break

                        case 'pullAnswer':
                            console.log(data.answer)
                            GameSocketService.pullAnswer(ws, user, data.task, data.answer.type, data.answer.score, data.answer.answer )
                            break
                        case 'pullScore':

                            break
                        case 'choiceTask':
                            GameSocketService.choiceTask(ws, user, userLocalId, data.task, data.level)
                            break

                        case 'moderation':
                            // sendMessage({action: 'moderation', user, task, score, moderation:moderationId})
                            console.log(data.task, data.score, data.moderation)
                            GameSocketService.pullModeration(ws, data.user, data.task, data.score, data.moderation)
                            break
                        case 'finishGame':
                            GameSocketService.finishGame()
                            break
                        case 'removeConfig':
                            GameSocketService.removeConfig()
                            break

                    }
                })

                ws.on('close', ()=> {
                    if (user && user.role)
                        GameSocketService.disconnect(userLocalId, user.role)
                })
            })

        }catch (e) {
            console.log(e)
        }
    }
}

module.exports = new SocketRouter()