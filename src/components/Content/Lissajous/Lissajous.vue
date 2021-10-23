<template>
<div class="mt-2 mx-2">
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
    {{time}}
</div>
</template>

<script>
import * as d3 from "d3";

const calculateSin = (A, F, time, scaleX, scaleY) => {
    const timeArr = new Array(400).fill(null).map((el, i) => (i + time) / scaleX)
    return timeArr.map((t, i) => [scaleY * A * Math.sin(4 * F * t), scaleY * A * Math.sin(F * t)])
}

const drawGraph = (points, w, h) => {
    const line = d3.line()(points)
    d3.select('.svg-container')
        .append('g')
            .attr('transform', `translate(${w / 2},${h / 2})`)
        .append('path')
            .attr('id', 'svg-graph')
            .attr("fill", "none")
            .attr("stroke", "black")
            .attr("stroke-width", "0.7")
            .attr('d', line);
}

const updateGraph = (points) => {
    const line = d3.line()(points)
    d3.select('#svg-graph')
        .attr('d', line);
}

const stopTimer = (timer) => {
    clearInterval(timer)
}

export default {
    name: "Lissajous",
    data: () => ({
        size: {
            width: 400,
            height: 400,
        },
        isAnimationActive: false,
        timer: undefined,
        signals: {
            1: {
                A: 1,
                F: 1000
            },
            2: {
                A: 1,
                F: 1000
            },
            dPhi: 0
        },
        time: 0,
        phase: 0,
        scaleX: 10000,
        scaleY: 100,

    }),
    mounted() {
        const svg = d3.select('#svg').append('svg')
            .attr('width', this.size.width)
            .attr('height', this.size.height)
            .attr('class', 'svg-container');


        drawGraph(
            calculateSin(this.signals[1].A, this.signals[1].F, 0, this.scaleX, this.scaleY),
            400, 400)
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
            const startTime = new Date().getTime()
            const timer = setInterval(() => {
                this.time = (new Date().getTime() - startTime) / 1000
                const sin = calculateSin(this.signals[1].A, this.signals[1].F, this.time, this.scaleX, this.scaleY)
                updateGraph(sin)
            }, 10)
            return timer
        }
    }
}
</script>

<style scoped>

</style>