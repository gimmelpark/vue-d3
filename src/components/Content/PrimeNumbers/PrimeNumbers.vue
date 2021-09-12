<template>
    <div class="d-flex pa-4" style="position: relative;">
        <div :style="`width: ${size.width + 20}px;`">
            <div id="svg"></div>
            <div class="ma-2 px-3 scale-slider">
                <v-slider :min="minScaleSlider"
                          :max="maxScaleSlider"
                          v-model="scaleSliderValue"
                          @change="onScaleSliderCgange"
                          color="grey lighten-1"
                          track-color="grey lighten-1"
                          thumb-color="blue-grey darken-1"
                          label="Размер"
                ></v-slider>
            </div>
        </div>
        <div class="control-block mt-2 ml-3 mr-2 d-flex flex-column justify-start">
            <v-btn depressed
                   rounded
                   color="blue-grey darken-1"
                   class="white--text"
                   @click="onHintBtnClick"
                   style="text-transform: none;"
            >Что это?</v-btn>
            <div class="mb-2 mt-5 d-flex flex-column justify-center">
                <v-switch inset
                          v-model="showAxes"
                          label="Оси"
                          hide-details
                          class="mt-0 ml-4 pt-0"
                          @change="onShowAxesSwitch"
                          color="blue-grey darken-1"></v-switch>
            </div>
        </div>
        <v-overlay absolute :value="showOverlay"
                   opacity="0.8"
                   class="d-flex flex-column justify-start"
        >
            <div class="d-flex flex-column justify-start" style="width: 722px;">
                <v-btn @click="onHintBtnClick"
                       depressed
                       rounded
                       color="amber lighten-5"
                       class="grey--text text--darken-3 align-self-end mt-6 mr-6"
                       style="width: 150px; text-transform: none;"
                >Закрыть</v-btn>

                <div class="text-center" style="margin-top: 180px;">
                    <p>То, что вы видите - множество точек в полярной системе координат.</p>
                    <p>Угол и радиус каждой точки - простое число.</p>
                    <p>При отдалении они образуют интересные узоры.</p>
                </div>
            </div>

        </v-overlay>
    </div>
</template>

<script>
import * as d3 from 'd3'

const isItPrime = function (n) {
    if (n % 2 === 0) return false;
    for (let x = 3; x <= Math.sqrt(n); x += 2) {
        if (n % x === 0) return false;
    }
    return true;
}

const allPrimeNumbers = function (min, max) {
    const res = [];
    for (let x = min; x <= max; x++) {
        if (isItPrime(x)) res.push(x);
    }
    return res;
}

const calculateNumbers = function (numbers, scale, maxSize = 500) {
    if (numbers.length === 0) numbers = [2]
    // наибольшее число, необходимое для заполнения поля
    const max = Math.round(scale * Math.ceil(maxSize / 2 * Math.sqrt(2)));

    if (max > numbers[numbers.length - 1]) {
        const newNumbers = allPrimeNumbers(numbers[numbers.length - 1] + 1, max)
        return [...numbers, ...newNumbers];
    }
    if (max < numbers[numbers.length - 1]) {
        return numbers.slice(0, numbers.findIndex(el => el >= max))
    }
    return numbers
}

const polarToDecart = function (a, r) {
    return [
        r * Math.cos(a),
        -r * Math.sin(a)
    ]
}

const draw = function (dotsGroups, numbers, scale, h, w, groupSize = 100) {

    const sizeOffset = Math.min(Math.max(-.26666 * Math.log10(scale) + 1, .2), 1)
    const getSize = function (r) {
        return Math.min((r / Math.max(h, w)) + sizeOffset, 1)
    }

    const numbersPacks = [...numbers]

    let groupId = 0

    dotsGroups.forEach( group => {group.actual = false})

    const drawPack = function (restData) {
        const groupData = restData.slice(0, groupSize)

        const dotsCoordinates = groupData.map(num => [...polarToDecart(num, num / scale), num / scale])

        let group = d3.select('.svg-container')
            .selectAll(`.dot-${groupId}`)
            .data(dotsCoordinates);

        group.exit().remove()

        const drawNew = function (groupId) {
            group.enter()
                .append('circle')
                .attr('class', `dot-${groupId}`)
                .attr('fill', '#000000')
                .attr('transform', `translate(${w / 2},${h / 2})`)
                .attr('cx', (d) => d[0])
                .attr('cy', (d) => d[1])
                .attr('r', (d) => getSize(d[2]));
        }.bind(this, groupId)

        setTimeout( drawNew, 0 )

        group.transition()
            .attr('cx', (d) => d[0])
            .attr('cy', (d) => d[1])
            .attr('r', (d) => getSize(d[2]));

        if (!dotsGroups.some( group => group.groupId === groupId )) {
            dotsGroups.push({
                group,
                groupId,
                actual: true,
            })
        } else {
            dotsGroups.find( group => group.groupId === groupId ).actual = true
        }

        groupId++

        restData = restData.slice(groupSize)

        if (restData.length === 0) {
            return 0;
        }

        drawPack(restData)

    }

    drawPack(numbersPacks)

    dotsGroups.filter( group => !group.actual )
        .forEach( group => {
            d3.selectAll(`.dot-${group.groupId}`)
            .remove();
    })
    return dotsGroups.filter( group => group.actual )

}

const drawAxes = function (scale, h, w) {
    const axesColor = '#7c7c7c'
   /* const axesStepsSizes = [
        [1, 50],
        [10, 500],
        [100, 5000],
        [1000, 5000],
    ]

    const axeCirclesRadiuses = [];
    const stepSize = axesStepsSizes.find( el => el[0] >= scale)[1]
    let step = 1
    while (step * stepSize / scale < .5 * Math.sqrt(h * h + w * w)) {
        axeCirclesRadiuses.push(step * stepSize)
        step++
    }

    const circles = d3.select('.svg-container')
        .selectAll('.axes-circle');

    circles.data(axeCirclesRadiuses).exit().remove();

    circles.data(axeCirclesRadiuses).enter()
        .append('circle')
            .attr('r', d => d / scale)
            .attr('cx', w / 2)
            .attr('cy', h / 2)
            .attr('class', '.axes-circle')
            .attr('stroke', axesColor)
            .attr('stroke-width', .5)
            .attr('fill', 'none');

    circles.data(axeCirclesRadiuses).transition()
        .attr('r', d => d / scale);*/

    const axeCircle = (r) => {
        d3.select('.svg-container').append('circle')
            .attr('r', r)
            .attr('cx', w / 2)
            .attr('cy', h / 2)
            .attr('class', 'axes')
            .attr('stroke', axesColor)
            .attr('stroke-width', .5)
            .attr('fill', 'none')
    }

    axeCircle(Math.max(h, w) / 2)
    axeCircle(Math.max(h, w) / 4)

    const axeLine = (p1, p2) => {
        d3.select('.svg-container').append('line')
            .attr('x1', p1[0])
            .attr('y1', p1[1])
            .attr('x2', p2[0])
            .attr('y2', p2[1])
            .attr('class', 'axes')
            .attr('stroke', axesColor)
            .attr('stroke-width', .5)
    }

    axeLine([0, h / 2], [w, h / 2])
    axeLine([w / 2, 0], [w / 2, h])
    axeLine([0, h], [w, 0])
    axeLine([0, 0], [w, h])

}

const hideAxes = function () {
    d3.selectAll('.axes').remove()
}

export default {
    name: "PrimeNumbers",
    data: () => ({
        size: {
            width: 500,
            height: 500,
        },
        scale: .5,
        scaleSliderValue: undefined,
        minScale: .1,
        maxScale: 1000,
        numbers: [],
        groups: [],
        showAxes: false,
        showOverlay: false,
    }),
    created() {
        this.scaleSliderValue = Math.log10(this.scale) * 100
        this.numbers = calculateNumbers([], this.scale, Math.max(this.size.width, this.size.height))
    },
    mounted() {
        const svg = d3.select('#svg').append('svg')
            .attr('width', this.size.width)
            .attr('height', this.size.height)
            .attr('class', 'svg-container')

        if (this.showAxes) drawAxes (this.scale, this.size.height, this.size.width)

        this.groups = draw(this.groups, this.numbers, this.scale, this.size.height, this.size.width)
    },
    computed: {
        minScaleSlider() {
            return Math.log10(this.minScale) * 100
        },
        maxScaleSlider() {
            return Math.log10(this.maxScale) * 100
        },
    },
    methods: {
        onScaleSliderCgange() {
            this.scale = (10 ** (this.scaleSliderValue / 100));
        },
        onShowAxesSwitch() {
            if (this.showAxes) {
                drawAxes(this.scale, this.size.height, this.size.width)
            } else {
                hideAxes()
            }
        },
        onHintBtnClick () {
            this.showOverlay = !this.showOverlay
        },
    },
    watch: {
        scale: function (newScale, oldScale) {
            // if (this.showAxes) drawAxes (this.scale, this.size.height, this.size.width)
            setTimeout(() => {
                this.numbers = calculateNumbers(this.numbers, this.scale, Math.max(this.size.width, this.size.height))
                setTimeout(() => {
                    this.groups = draw(this.groups, this.numbers, newScale, this.size.height, this.size.width)
                }, 0)
            }, 0)
        }
    },
}
</script>

<style scoped>
.scale-slider {
    height: 30px;
    background-color: #ffffff;
    border-radius: 15px;
}
.control-block {
    width: 150px;
}
.control-block > div {
    height: 50px;
    border-radius: 25px;
    background-color: #ffffff;
}
</style>