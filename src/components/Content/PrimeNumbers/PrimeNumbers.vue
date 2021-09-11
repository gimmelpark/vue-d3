<template>
    <div>
        <div id="svg"></div>
        <div>
            <v-slider :min="minScaleSlider"
                      :max="maxScaleSlider"
                      v-model="scaleSliderValue"
                      @change="onScaleSliderCgange"
                      color="blue"
            ></v-slider>
            {{ scale }}
        </div>
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

    const drawPack = function (restData) {

        const groupData = restData.slice(0, groupSize)

        const dotsCoordinates = groupData.map(num => [...polarToDecart(num, num / scale), num / scale])

        let group = d3.select('.svg-container')
            .selectAll(`.dot-${groupId}`)
            .data(dotsCoordinates);

        group.exit().remove()

        group.enter()
            .append('circle')
            .attr('class', `dot-${groupId}`)
            .attr('fill', '#000000')
            .attr('transform', `translate(${w / 2},${h / 2})`)
            .attr('cx', (d) => d[0])
            .attr('cy', (d) => d[1])
            .attr('r', (d) => getSize(d[2]));

        group.transition()
            .attr('cx', (d) => d[0])
            .attr('cy', (d) => d[1])
            .attr('r', (d) => getSize(d[2]));

        if (!dotsGroups.some( el => el.groupId === groupId )) {
            dotsGroups.push({
                group,
                groupId,
            })
        }

        groupId++

        restData = restData.slice(groupSize)

        if (restData.length === 0) {
            return 0;
        }

        setTimeout(drawPack(restData), 0)

    }

    drawPack(numbersPacks)

    console.log(dotsGroups, dotsGroups.findIndex( group => group.groupId === groupId - 1))
    dotsGroups.slice(dotsGroups.findIndex( group => group.groupId === groupId - 1))
        .forEach( group => {
            d3.selectAll(`.dot-${groupId - 1}`)
            .remove();
    })
    return dotsGroups.slice(0, dotsGroups.findIndex( group => group.groupId === groupId - 1))

}

export default {
    name: "PrimeNumbers",
    data: () => ({
        size: {
            width: 500,
            height: 500,
        },
        scale: 10,
        scaleSliderValue: undefined,
        minScale: 1,
        maxScale: 1000,
        numbers: [],
        groups: [],
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

        // d3.select('.svg-container').append('line')
        //     .attr('x1', 0)
        //     .attr('x2', this.size.width)
        //     .attr('y1', this.size.height / 2)
        //     .attr('y2', this.size.height / 2)
        //     .attr('stroke', '#7c7c7c')
        //     .attr('stroke-width', .5)
        //
        // d3.select('.svg-container').append('line')
        //     .attr('y1', 0)
        //     .attr('y2', this.size.height)
        //     .attr('x1', this.size.width / 2)
        //     .attr('x2', this.size.width / 2)
        //     .attr('stroke', '#7c7c7c')
        //     .attr('stroke-width', .5)

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
        }
    },
    watch: {
        scale: function (newScale, oldScale) {
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

</style>