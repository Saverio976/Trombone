const Icons = {
    email: require("./assets/icons/email.png"),
    lock: require("./assets/icons/lock.png"),
    arrowLeft: require("./assets/icons/arrow-left.png"),
    arrowRight: require("./assets/icons/arrow-right.png"),
    cogwheel: require("./assets/icons/cogwheel.png"),
    search: require("./assets/icons/magnifying_glass.png"),
    sort: require("./assets/icons/sort.png"),
    tomato: require("./assets/icons/tomate21-2415639179.png"),
}

const c = "clear_sky"
const m = "mainly_clear"
const f = "fog"
const d = "drizzle"
const r = "rain"
const fr = "freezing_rain"
const sf = "snow_fall"
const sg = "snow_grains"
const rs = "rain_showers"
const ss = "snow_showers"
const t = "thunderstorm"
const th = "thunderstorm_hail"

export const Images = {
    logo: require("./assets/logo.png"),
    logoCircle: require("./assets/logo_circle.png"),
    login_bg: require("./assets/login_bg.png"),
    weather: {
        c:  require(`./assets/weather/${c}.jpg`),
        m:  require(`./assets/weather/${m}.jpg`),
        f:  require(`./assets/weather/${f}.jpg`),
        d:  require(`./assets/weather/${d}.jpg`),
        r:  require(`./assets/weather/${r}.jpg`),
        fr: require(`./assets/weather/${fr}.jpg`),
        sf: require(`./assets/weather/${sf}.jpg`),
        sg: require(`./assets/weather/${sg}.jpg`),
        rs: require(`./assets/weather/${rs}.jpg`),
        ss: require(`./assets/weather/${ss}.jpg`),
        t:  require(`./assets/weather/${t}.jpg`),
        th: require(`./assets/weather/${th}.jpg`),
    },
}

export default Icons
