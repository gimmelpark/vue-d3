import Vue from 'vue'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import '@mdi/font/css/materialdesignicons.css'
import colors from 'vuetify/lib/util/colors'

Vue.use(Vuetify)

const opts = {
    icons: {
        iconfont: 'mdi'
    },
    theme: {
        themes: {
            light: {
                primary: colors.grey.lighten3,
                secondary: colors.blueGrey.darken3,
                background1: '#fcefe1',
            },
        },
    },
}

export default new Vuetify(opts)