const taskService = require('../Services/ComponentServices/TaskService')
const userService = require('../Services/ComponentServices/userService')
const tokenService = require("../Services/ComponentServices/tokenService");
const SendMessage = require('./SendMessage')
const ConfigGameService = require('../Services/ConfigGameService')

class GameSocketService {

    timeFinish = 4 * 60 * 60
    tasks
    isStart = false
    isFinish = false
    timer = null
    isInit = false
    finishTime
    scores = []
    currentTime = 0
    playTasks = []
    finishTasks = []
    usersWs = []
    adminsWs = []

    helps=[
        'Доберитесь до 3 этажа и найдите код между Ждуном и шкафом с наградами.',
            'Необходимо добраться до кабинета транспортного отдела на первом этаже и попросить код у одного из сотрудников кабинета.',
            'Следуй в кофетерий и по дороге найдешь тару по сбору пластика. Захвати с собой ненужный пластик с рабочего стола.',
            'Код находится на столе около Эйфелевой башни между микроволновками.',
            'Код находится рядом с курьерским ресепшеном, на стеллаже с посылками.',
            'Ищи код в углу офиса на комоде около коллег, там тебя будет ждать сказочный персонаж нашего офиса.',
            'Эти мусорные баки охраняют 6 прекрасных моделей с шикарными укладками.',
            'На этаже рядом с постером девушки с ярким макияжем и зелеными тенями открываются дверцы, где лежат 2 огнетушителя.',
            'Стол рядом с настольным футболом.',
            'Тениссный стол в зоне для курения.',
            'Вход на парковку, около двери.',
            'Ресепшн IT отдела.',
            'Код находится рядом с местным скелетом Андрюшкой.',
            'Около ткацкого станка.',
            'Найди большой крем CeraVe.'

    ]
//{"answer":"life212"}
    worldsQr = [
        'fire32',
        'table44',
        'door23',
        'window111',
        'room27',
        'save17',
        'hose243',
        'safely27',
        'book71',
        'security113',
        'hand2',
        'work777',
        'learn92',
        'tree119',
        'life212',
    ]
    worldsArText = [
        'скораяпомощь103',
        'пожарнаямчс101',
        'единаяслужбаспасения112'

    ]
    arAdditionalSetting = {
        hard: this.helps.filter((h,i)=>i<5),
        middle: this.helps.filter((h,i)=>i<10),
        lite: this.helps.filter((h,i)=>i<15),
        time: {
            hard: 5 * 60,
            middle: 10 * 60,
            lite: 20 * 60,
        },
        count: 10
    }

    constructor() {
        SendMessage.adminsWs = this.adminsWs
        SendMessage.usersWs = this.usersWs
    }

//----------------таймер
    startTimer() {
        // console.log('start timer', this.currentTime)
        if (this.timer)
            clearInterval(this.timer)
        if (!this.currentTime)
            this.currentTime = 0
        this.timer = setInterval(() => this._tickTimer(), 1000)
    }

    _tickTimer() {
        // console.log(this.currentTime)

        if (!this.currentTime)
            this.currentTime = 0
        this.currentTime++
        if (this.currentTime%10===0){
            this.saveProgress()
        }
        SendMessage.sendTime(this.currentTime)
        this.checkTaskByTimeout()

        if(this.currentTime>=this.timeFinish){
          this.finishGame()
        }
    }

    finishGame(){
        if(this.timer)
            clearInterval( this.timer)
        this.isFinish = true
        SendMessage.sendAll({action:'finish', scores:this.scores})
    }

    stopTimer() {

    }

    // this.finishTasks.push({user:user, task:task.id, status:'win', score})
    //  this.playTasks.push({user, userLocalId, task:task.id, timeStart})
    //    this.scores.push({user, score: 0, win: 0, last: 0})
    checkTaskByTimeout() {
        const finish = this.playTasks.filter(pt => this.currentTime >= pt.finishTime)
        if (finish.length > 0) {
            finish.forEach(f => {
                this.finishTasks.push({user: f.user, task: f.task, status: 'last', score: f.score})
                const s = this.scores.find(s => s.user.id === f.user.id)
                s.last += 1
                s.score+=f.score
                this.tasks.find(t => t.id === f.task).isBlock = false
            })
            this.playTasks = this.playTasks.filter(pt => finish.find(f => f.user.id !== pt.user.id))

            finish.forEach(f => {
                const userWs = this.usersWs.filter(uw => uw.userId === f.user.id)
                if (userWs && userWs.length>0) {
                    const currentScore = this.scores.find(s => s.user.id === f.user.id)
                    userWs.forEach((uw)=>{
                        SendMessage.sendMessage(uw.ws, {
                            action: 'reportTask',
                            status: 'last',
                            scoreAdd: 0,
                            task: this.tasks.find(t => t.id === f.task),
                            score: currentScore,
                            finishTask: this.finishTasks.filter(ft => ft.user.id === f.user.id)
                        })
                    })
                }
            })
            SendMessage.sendAdmins({action: 'score', score: this.scores, finishTask: this.finishTasks})
            SendMessage.sendAll({action: 'tasks', tasks: this.tasks})
        }
    }

    async choiceTask(ws, user, userLocalId, task, level) {
        const timeStart = this.currentTime
        const currentTask = {...this.tasks.find(t => t.id === task.id)}
        currentTask.timeStart = timeStart
        console.log(task.type)
        if (task.type === 'gameGuru')
            this.tasks.find(t => t.id === task.id).isBlock = true
        currentTask.questions = await taskService.getQuestionByTaskId(currentTask.id)

        if(task.type === 'arText'){
            this.playTasks.push({
                user,
                userLocalId,
                score: 0,
                task: task.id,
                timeStart,
                finishTime: timeStart + task.timeDuration,
                count: 0,
                words: [...this.worldsArText],
            })
        }
        else if (level) {
            currentTask.level = level
            this.playTasks.push({
                user,
                userLocalId,
                score: 0,
                task: task.id,
                timeStart,
                finishTime: timeStart + this.arAdditionalSetting.time[level],
                level,
                count: 0,
                wordsQr: [...this.worldsQr],
                words: this.arAdditionalSetting[level]
            })
        } else {
            this.playTasks.push({
                user,
                userLocalId,
                score: 0,
                count: 0,
                finishTime: timeStart + task.timeDuration,
                task: task.id,
                timeStart
            })
        }
        const playTask = this.playTasks.find(pt => pt.user.id === user.id)
        const userWs = this.usersWs.filter(uw => uw.userId === user.id)
        userWs.forEach(uw=>{
            SendMessage.sendMessage(uw.ws, {action: 'choiceTask', optionTask: playTask, task: currentTask})
        })
        SendMessage.sendAll({action: 'tasks', tasks: this.tasks})
    }

//----------------упраление сокет-пользователями
    async connectUser(ws, token, userLocalId) {
        const user = tokenService.validationToken(token)
        let currentTask = this.playTasks.find(pt => pt.user.id === user.id)
        if (!user)
            return {warning: true, badToken: true}
        let score
        let finishTask
        if (user.role === 'admin') {
            this.adminsWs.push({ws, userLocalId, userId: user.id})
            score = this.scores
            finishTask = this.finishTasks
            return {
                warning: false, score, moderation: await taskService.getAnswerNotModeration(),
                badToken: false, user, tasks: this.tasks, isStart: this.isStart, isFinish: this.isFinish,
                finishTask, timeFinish: this.timeFinish
            }
        } else {
            const currentScore = this.scores.find(s => s.user.id === user.id)
            if (!currentScore) {
                this.scores.push({user, score: 0, win: 0, last: 0, moderation: 0})
                SendMessage.sendAdmins({action: 'score', finishTask: this.finishTasks, score: this.scores})
            }
            score = currentScore ? currentScore : {user, score: 0, win: 0, last: 0}
            finishTask = this.finishTasks.filter(ft => ft.user.id === user.id)
            this.usersWs.push({ws, userLocalId, userId: user.id})
        }
        const userTask = currentTask ? {
            ...this.tasks.find(t => t.id === currentTask.task),
            timeStart: currentTask.timeStart
        } : null
        if (userTask)
            userTask.questions = await taskService.getQuestionByTaskId(userTask.id)
        return {
            warning: false,
            timeFinish: this.timeFinish,
            score,
            scores:this.scores,
            time: this.currentTime,
            optionTask: currentTask,
            currentTask: userTask,
            badToken: false,
            user,
            tasks: this.tasks,
            isStart: this.isStart,
            isFinish: this.isFinish,
            finishTask
        }
    }

    disconnect(userLocalId, userRole) {
        if (userRole)
            switch (userRole) {
                case 'user':
                    this.usersWs = this.usersWs.filter(uw => uw.userLocalId !== userLocalId)
                    SendMessage.usersWs = this.usersWs
                    break
                case 'admin':
                    this.adminsWs = this.adminsWs.filter(uw => uw.userLocalId !== userLocalId)
                    SendMessage.adminsWs = this.adminsWs
                    break
            }
    }

//----------------управление игрой
    startGame() {
        if (this.isStart)
            return
        console.log('start game')
        this.isStart = true
        this.startTimer()
        SendMessage.sendAll({action: 'gameStart'})
    }

    stopGame() {
        clearInterval(this.timer)
        this.isStart = false
        SendMessage.sendAll({action: 'gameStop'})
        this.timer = null
    }

    async refreshGame() {
        await this.init()
        this.currentTime = 0
        this.playTasks = []
        this.finishTasks = []
        this.scores = []
        // this.adminsWs = []
        // this.usersWs = []
        // SendMessage.usersWs = this.usersWs
        // SendMessage.adminsWs = this.adminsWs
        SendMessage.sendAll({action: 'refresh'})
    }

//----------------взаимодействия по счету
    async pullModeration(ws, user, task, score, moderation) {
        try {
            const currentScore = this.scores.find(s => s.user.id === user.id)
            if (!currentScore)
                return
            currentScore.moderation--
            if (score > 0)
                currentScore.win++
            else
                currentScore.last++
            currentScore.score += score
            // this.finishTasks.push({user:user, task:task.id, status:'moderation', score:0})
            const ft = this.finishTasks.filter(f => f.user.id === user.id && f.task === task.id)
            ft.score = score
            ft.status = score > 0 ? 'win' : 'last'
            await taskService.setModerationAnswer(moderation)
            SendMessage.sendAdmins({action: 'score', score: this.scores, finishTask: this.finishTasks})
            SendMessage.sendAdmins({action: 'moderation', moderation: await taskService.getAnswerNotModeration()})

        } catch (e) {
            console.log(e)
        }

    }

//     this.scores.push({user, score: 0, win: 0, last: 0, moderation:0})
    async pullAnswer(ws, user, task, typeAnswer, score, answer) {
        const currentTask = this.playTasks.find(pt => pt.user.id === user.id && task.id === pt.task)
        const currentScore = this.scores.find(s => s.user.id === user.id)
        const userWs = this.usersWs.filter(uw => uw.userId === user.id)
        if (currentTask) {
            switch (typeAnswer) {
                case 'arText':
                    const playTaskArText = this.playTasks.find(pt => pt.user.id === user.id)
                    playTaskArText.count += 1
                    playTaskArText.score += task.price
                    playTaskArText.words = playTaskArText.words.filter(p => p !== answer)
                    if (playTaskArText.words.length === 0) {
                        const finishAr = {user, task: playTaskArText.task, status: 'win', score: playTaskArText.score}
                        this.finishTasks.push(finishAr)
                        currentScore.score += playTaskArText.score
                        currentScore.win++
                        this.playTasks = this.playTasks.filter(p => p.user.id !== user.id)
                        //  task, score:currentScore,  finishTask:this.finishTasks.filter(ft=>ft.user.id === user.id)}
                        userWs.forEach(uw=>{
                            SendMessage.sendMessage(uw.ws, {
                                action: 'reportTask',
                                status: 'win',
                                scoreAdd: playTaskArText.score,
                                task: this.tasks.find(t => t.id === playTaskArText.task),
                                score: currentScore,
                                finishTask: this.finishTasks.filter(ft => ft.user.id === user.id)
                            })
                        })

                        SendMessage.sendAdmins({action: 'score', score: this.scores, finishTask: this.finishTasks})
                        SendMessage.sendAll({action: 'tasks', tasks: this.tasks})
                    }
                    SendMessage.sendMessage(ws, {action: 'reportArText', optionTask: playTaskArText})
                    break
                case 'foto':
                    currentScore.moderation += 1
                    this.playTasks = this.playTasks.filter(pt => pt.user.id !== user.id)
                    this.finishTasks.push({user: user, task: task.id, status: 'moderation', score: 0})
                    await taskService.setAnswer(task.id, user.id, answer)
                    userWs.forEach(uw=>{
                        SendMessage.sendMessage(uw.ws, {
                            action: 'reportTask',
                            status: 'moderation',
                            scoreAdd: score,
                            task,
                            score: currentScore,
                            finishTask: this.finishTasks.filter(ft => ft.user.id === user.id)
                        })
                    })
                    SendMessage.sendAdmins({action: 'score', score: this.scores, finishTask: this.finishTasks})
                    SendMessage.sendAdmins({
                        action: 'moderation',
                        moderation: await taskService.getAnswerNotModeration()
                    })
                    SendMessage.sendAll({action: 'tasks', tasks: this.tasks})
                    break
                case 'qr':
                    currentScore.score += score
                    currentScore.win += 1
                    this.playTasks = this.playTasks.filter(pt => pt.user.id !== user.id)
                    this.finishTasks.push({user: user, task: task.id, status: 'win', score})
                    const t = this.tasks.find(t => task.id === t.id)
                    if (t)
                        t.isBlock = false
                    userWs.forEach(uw=>{
                        SendMessage.sendMessage(uw.ws, {
                            action: 'reportTask',
                            status: 'win',
                            scoreAdd: score,
                            task,
                            score: currentScore,
                            finishTask: this.finishTasks.filter(ft => ft.user.id === user.id)
                        })
                    })

                    SendMessage.sendAdmins({action: 'score', score: this.scores, finishTask: this.finishTasks})
                    SendMessage.sendAll({action: 'tasks', tasks: this.tasks})
                    break
                case 'ar':
                    const playTask = this.playTasks.find(pt => pt.user.id === user.id)
                    const ta = this.tasks.find(t => task.id === t.id)
                    playTask.count += 1
                    playTask.score += ta.price
                    playTask.wordsQr = playTask.wordsQr.filter(p => p !== answer)
                    if (playTask.wordsQr.length === 0) {
                        const finishT = {user, task: playTask.task, status: 'win', score: playTask.score}
                        this.finishTasks.push(finishT)
                        currentScore.score += playTask.score
                        currentScore.win++
                        this.playTasks = this.playTasks.filter(p => p.user.id !== user.id)
                        //  task, score:currentScore,  finishTask:this.finishTasks.filter(ft=>ft.user.id === user.id)}
                        userWs.forEach(uw=>{
                            SendMessage.sendMessage(uw.ws, {
                                action: 'reportTask',
                                status: 'win',
                                scoreAdd: playTask.score,
                                task: this.tasks.find(t => t.id === playTask.task),
                                score: currentScore,
                                finishTask: this.finishTasks.filter(ft => ft.user.id === user.id)
                            })
                        })

                        SendMessage.sendAdmins({action: 'score', score: this.scores, finishTask: this.finishTasks})
                        SendMessage.sendAll({action: 'tasks', tasks: this.tasks})
                    }
                    SendMessage.sendMessage(ws, {action: 'reportAr', optionTask: playTask})
                    break
                case 'rebus':
                    const taskR = this.tasks.find(t => task.id === t.id)
                    if (answer.isExit) {
                        this.playTasks = this.playTasks.filter(pt => pt.user.id !== user.id)
                        const status = currentTask.score > 0 ? 'win' : 'last'
                        const addScore = currentTask.score
                        currentScore.score += addScore
                        console.log('addScore', addScore)
                        if (addScore > 0)
                            currentScore.win += 1
                        else
                            currentScore.last += 1
                        this.finishTasks.push({user: user, task: task.id, status, score: addScore})
                        SendMessage.sendAdmins({action: 'score', score: this.scores, finishTask: this.finishTasks})
                        userWs.forEach(uw=>{
                            SendMessage.sendMessage(ws, {
                                action: 'reportTask', status,
                                scoreAdd: addScore, task, score: currentScore,
                                finishTask: this.finishTasks.filter(ft => ft.user.id === user.id)
                            })
                        })
                    } else {
                        if (answer.isWin) {
                            currentTask.score += taskR.price
                        }
                        currentTask.count++
                    }
            }
        }

    }

    pullScore(data, user) {

    }

    pullAnswerNotExit(data, user) {

    }

//----------------управление игровыми событиями



//----------------загрузка данных из бд
    async init() {
        this.tasks = await this.loadTasks()
        await this.getProgress()

        this.isInit = true
        if (this.isStart) {
            this.isStart = false
            this.startGame()
        }

    }

    async loadTasks() {
        const tasksBd = await taskService.getTasksNotQuestions()
        return tasksBd.tasks
    }
    async removeConfig(){
        await this.removeProgress()
        if (this.timer)
            clearInterval(this.timer)
        this.timer = null
        this.isStart = false
        this.tasks = []
        this.isStart = false
        this.isFinish = false
        this.isInit = false
        this.scores = []
        this.currentTime = 0
        this.playTasks = []
        this.finishTasks = []
        this.usersWs = []
        this.adminsWs = []
    }
    // timeFinish = 4 * 60 * 60
    // tasks
    // isStart = false
    // isFinish = false
    // timer = null
    // isInit = false
    // finishTime
    // scores = []
    // currentTime = 0
    // playTasks = []
    // finishTasks = []
    // usersWs = []
    // adminsWs = []

    saveProgress(){
        ConfigGameService.saveConfigAndProgress({
            isStart:this.isStart,
            isFinish:this.isFinish,
            currentTime:this.currentTime,
            playTasks:this.playTasks,
            finishTasks:this.finishTasks,
        })
    }

    async getProgress(){
        const p = await ConfigGameService.getConfigAndProgress()
        if (!p)
            return false
        this.isStart = p.isStart
        this.isFinish=p.isFinish
        this.currentTime=p.currentTime
        this.playTasks=p.playTasks
        this.finishTasks=p.finishTasks
        return true
    }
    async removeProgress(){
        await ConfigGameService.removeProgress()
        await taskService.removeAllAnswers()
    }

}

module.exports = new GameSocketService()