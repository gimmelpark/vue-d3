<template>
    <div class="px-4 pt-4 pb-3">
        <div id="svg"></div>
        <div>
            <v-btn small
                   fab
                   color="blue-grey darken-1"
                   class="white--text ml-2"
                   @click="onPlayBtnClick">
                <v-icon>mdi-{{isAnimationActive? 'pause': 'play'}}</v-icon>
            </v-btn>
        </div>
    </div>
</template>

<script>
import * as d3 from "d3";

const createNumbers = (maxN) => new Array(maxN + 1).fill(null).map((_, i) => i)

const calculateSpiral = (numbers, angle) => {
    const spiralNums = numbers.map(el => [
        angle * el,
        1.7 * el,
    ])
    return d3.lineRadial()(spiralNums)
}

const addSpiral = (spiralNums, h, w) => {
    d3.select('.svg-container')
        .append('g')
            .attr('transform', `translate(${w / 2},${h / 2})`)
        .append('path')
            .attr('id', 'svg-spiral')
            .attr("fill", "none")
            .attr("stroke", "black")
            .attr("stroke-width", "0.7")
            .attr('d', spiralNums);
}

const updateSpiral = (spiralNums) => {
    d3.select('#svg-spiral')
        .attr('d', spiralNums);
}

const stopTimer = (timer) => {
    clearInterval(timer)
}

export default {
    name: "Spiral",
    data: () => ({
        size: {
            width: 400,
            height: 400,
        },
        numbers: [],
        maxN: 100,
        angle: 0,
        timer: undefined,
        isAnimationActive: false,
        timeValue: 20000,
    }),
    created() {
        this.numbers = createNumbers(this.maxN)
    },
    mounted() {
        const svg = d3.select('#svg').append('svg')
            .attr('width', this.size.width)
            .attr('height', this.size.height)
            .attr('class', 'svg-container');

        addSpiral(calculateSpiral(this.numbers, this.angle), this.size.height, this.size.width)

    },
    methods: {
        onPlayBtnClick() {
            this.isAnimationActive = !this.isAnimationActive
            if (this.isAnimationActive) {
                this.timer = this.startAnimation()
            } else {
                stopTimer(this.timer)
            }
        },
        startAnimation() {
            const startTime = new Date().getTime() - this.timeValue
            const timer = setInterval(() => {
                let time = new Date().getTime() - startTime
                this.timeValue = (new Date().getTime() - startTime) % 40000
                this.angle = (Math.PI * (-20 + ((this.timeValue / 1000) % 40))) / 40
                updateSpiral(calculateSpiral(this.numbers, this.angle))
            }, 10)
            return timer
        },
    },

    beforeDestroy() {
        stopTimer(this.timer)
    }
}
</script>

<style scoped>

</style>