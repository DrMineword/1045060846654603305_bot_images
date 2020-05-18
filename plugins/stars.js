"use strict";
const main = require('../generateGameData.js')
const globals = require('./globals.js')

let solarSysGenData = main.readCSV('solar_system_gen_data')
let globalsData = {
    BlueStar: globals.getGlobalsBy('BlueStar_'),
    WhiteStar: globals.getGlobalsBy('WS'),
    RedStar: globals.getGlobalsBy('RS')
}
exports.default = function (obj) {
    obj = main.combineObjects(obj, solarSysGenData)

    delete obj.RedStar.GhostSpawnSecs // лучше пусть будет в ships
    for (let key in obj) {
        let obj1 = obj[key]

        delete obj1.Models
        if (key in globalsData) { // добавить "globals"
            obj1 = main.combineObjects(obj1, globalsData[key])
        }
        if (key in solarSysGenData) { // фикс лвл из "solar_system_gen_data" т.к. в stars == 1 
            obj1.maxLevel = solarSysGenData[key].maxLevel
        }
        if (key == 'WhiteStar') {
            obj1.Lifetime = obj1.Lifetime * obj1.TimeSlowdownFactor
        }
        for (let i in obj1) { // фикс массивов из сточки
            if (Array.isArray(obj1[i]) || ignoringHeaders.includes(i)) continue;
            let arr = String(obj1[i]).split('!')

            arr = arr.map(e => main.fixValue(key, i, e))
            if (arr.length > 1) obj1[i] = arr
            if (arr[0] == null) delete obj1[i]
            if (arr.length > obj1.maxLevel) {
                obj1.maxLevel = arr.length
            }
        }
        main.fillSpace(obj1, ' ')
    }
    main.pushArrays(obj.RedStar, 'RegularInfuenceRange', 'RegularInfuenceRange_Min', 'RegularInfuenceRange_Max')
    main.pushArrays(obj.RedStar, 'InfluenceAwardThreshold', 'InfluenceAwardThreshold_Min', 'InfluenceAwardThreshold_Max')
    return obj
}