<script>
    import * as L from "partial.lenses";
    import * as R from "ramda";
    import {
        atom,
        storedAtom,
        view,
        update,
        combine,
        failableView,
        bindValue,
    } from "./svatom.svelte.js";
    export const {
        level = atom({
            size: { x: 10, y: 10 },
            start: { x: 5, y: 5 },
            walls: Array(10 * 10).fill(false),
            crystals: Array(10 * 10).fill(false),
        }),
        player = atom({
            pos: { x: 0, y: 0 },
            dir: { x: 0, y: -1 },
        }),
        errorPosition = atom(null),
        choice = atom(undefined),
        resolution = 32,
    } = $props();
    const viewBox = $derived(
        view(
            ({ size }) =>
                `-10 -10 ${size.x * resolution + 20} ${size.y * resolution + 20}`,
            level,
        ),
    );
    const dims = $derived(
        view(
            ({ size }) => ({
                width: size.x * resolution,
                height: size.y * resolution,
            }),
            level,
        ),
    );
</script>

<svg
    class="canvas"
    {...dims.value}
    viewBox={viewBox.value}
    preserveAspectRatio="xMidYMin meet"
>
    {#each { length: level.value.size.y } as _, y}
        {#each { length: level.value.size.x } as _, x}
            <rect
                x={x * resolution}
                y={y * resolution}
                width={resolution}
                height={resolution}
                fill="#f0f0f0"
                stroke="#ccc"
                shape-rendering="crispEdges"
                vector-effect="non-scaling-stroke"
            ></rect>
        {/each}
    {/each}
    {#each { length: level.value.size.y } as _, y}
        {#each { length: level.value.size.x } as _, x}
            {@const isWall = level.value.walls[y * level.value.size.x + x]}
            {@const showDigits =
                level.value.digits &&
                level.value.digits[y * level.value.size.x + x]}
            {@const isCrystal =
                level.value.crystals[y * level.value.size.x + x]}
            {#if isCrystal}
                {@render diamond(x, y, resolution)}
            {/if}
            {#if isWall}
                {@render wall(x, y, resolution)}
            {/if}
            {#if showDigits && (isWall || isCrystal)}
                {@const value = isWall
                    ? Array(level.value.size.x)
                          .fill(0)
                          .reduce(
                              (acc, v, i, all) =>
                                  acc +
                                  (level.value.crystals[
                                      y * level.value.size.x + i
                                  ] &&
                                  !level.value.walls[y * level.value.size.x + i]
                                      ? 1
                                      : 0) *
                                      Math.pow(2, all.length - 1 - i),
                              0,
                          )
                    : Math.pow(2, level.value.size.x - 1 - x)}
                {@render digit(x, y, resolution, value, isWall)}
            {/if}
        {/each}
    {/each}
    {@render robot(
        player.value.pos.x,
        player.value.pos.y,
        player.value.dir.x,
        player.value.dir.y,
        resolution,
        choice.value,
    )}
    {#if errorPosition.value}
        {@render error(
            errorPosition.value.pos.x,
            errorPosition.value.pos.y,
            resolution,
        )}
    {/if}
    <rect
        x={-3}
        y={-3}
        width={resolution * level.value.size.x + 6}
        height={resolution * level.value.size.y + 6}
        fill="none"
        stroke-width="6"
        stroke="#555"
        shape-rendering="crispEdges"
    ></rect>
</svg>
{#snippet robot(x, y, dx, dy, size, choice)}
    <g
        transform="rotate({(Math.atan2(dy, dx) * 180) / Math.PI + 90} {x *
            size +
            size / 2} {y * size + size / 2})"
    >
        <rect
            x={x * size}
            y={y * size + (size * (1 - 1 / 1.9)) / 2}
            width={size}
            height={size / 1.9}
            fill="#3300ff"
            stroke-width="1"
            stroke="#110022"
            rx="10"
            ry="10"
            vector-effect="non-scaling-stroke"
        ></rect>
        <circle
            cx={x * size + size / 2}
            cy={y * size + size / 2}
            r={size / 1.6 / 2}
            fill="#aaaadd"
            stroke-width="2"
            stroke="#1100aa"
            rx="10"
            ry="10"
            vector-effect="non-scaling-stroke"
        ></circle>
        <polygon
            stroke="#1100aa"
            stroke-width="1"
            points="{size * x + size / 2 - size / 6} {size * y +
                size / 2 +
                size / 20}
               {size * x + size / 2} {size * y +
                size / 2 -
                size / 6 +
                size / 20}
                   {size * x + size / 2 + size / 6} {size * y +
                size / 2 +
                size / 20}
                       "
            fill="#3300ff"
            class={{
                "choice-yes": choice === true,
                "choice-no": choice === false,
            }}
            stroke-linejoin="round"
            stroke-linecap="round"
        ></polygon>
        <circle
            fill="white"
            class={{
                "choice-yes": choice === true,
                "choice-no": choice === false,
            }}
            r="2.5"
            stroke-width="1.5"
            stroke="#1100aa"
            cx={size * x + size / 2 - size / 7}
            cy={size * y + size / 2 - size / 4}
        ></circle>
        <circle
            fill="white"
            class={{
                "choice-yes": choice === true,
                "choice-no": choice === false,
            }}
            r="2.5"
            stroke-width="1.5"
            stroke="#1100aa"
            cx={size * x + size / 2 + size / 7}
            cy={size * y + size / 2 - size / 4}
        ></circle>
    </g>
{/snippet}

{#snippet wall(x, y, size)}
    <rect
        x={x * size}
        y={y * size}
        width={size}
        height={size}
        fill="#555"
        stroke-width="0"
        shape-rendering="crispEdges"
    ></rect>
{/snippet}
{#snippet digit(x, y, size, value, wall)}
    <g>
        {#if wall}
            <text
                x={x * size + (size / 8) * 7}
                y={y * size + (size / 8) * 3}
                width={size}
                height={size}
                text-anchor="end"
                dominant-baseline="top"
                stroke="#000a"
                fill="#fff"
                stroke-width="2"
                font-size={size / 2}
                shape-rendering="crispEdges"
            >
                {value}
            </text>
            <text
                x={x * size + (size / 8) * 7}
                y={y * size + (size / 8) * 3}
                width={size}
                height={size}
                text-anchor="end"
                dominant-baseline="top"
                stroke="white"
                fill="#fff"
                stroke-width="0"
                font-size={size / 2}
                shape-rendering="crispEdges"
            >
                {value}
            </text>
        {:else}
            <text
                x={x * size + (size / 8) * 7}
                y={y * size + (size / 8) * 3}
                width={size}
                height={size}
                text-anchor="end"
                dominant-baseline="top"
                stroke="#dfda"
                fill="#040"
                stroke-width="2"
                font-size={size / 2}
                shape-rendering="crispEdges"
            >
                {value}
            </text>
            <text
                x={x * size + (size / 8) * 7}
                y={y * size + (size / 8) * 3}
                width={size}
                height={size}
                text-anchor="end"
                dominant-baseline="top"
                stroke="white"
                fill="#040"
                stroke-width="0"
                font-size={size / 2}
                shape-rendering="crispEdges"
            >
                {value}
            </text>
        {/if}
    </g>
{/snippet}
{#snippet diamond(x, y, size)}
    <polygon
        fill="#48f273"
        points="{size * x + size / 2} {size * y + size / 2} {size * x} {size *
            y +
            size / 2} {size * x + size / 2} {size * y} "
    ></polygon>
    <polygon
        fill="#28a233"
        points="{size * x + size / 2} {size * y + size / 2} {size * x +
            size} {size * y + size / 2} {size * x + size / 2} {size * y} "
    ></polygon>
    <polygon
        fill="#28b233"
        points="{size * x + size / 2} {size * y + size / 2} {size * x} {size *
            y +
            size / 2} {size * x + size / 2} {size * y + size} "
    ></polygon>
    <polygon
        fill="#285233"
        points="{size * x + size / 2} {size * y + size / 2} {size * x +
            size} {size * y + size / 2} {size * x + size / 2} {size * y +
            size} "
    ></polygon>
    <polygon
        stroke-linejoin="round"
        stroke-linecap="round"
        stroke="#285233"
        fill="none"
        points="{size * x + size / 2} {size * y}
           {size * x + size} {size * y + size / 2}
           {size * x + size / 2} {size * y + size}
           {size * x} {size * y + size / 2}

           "
    ></polygon>
{/snippet}
{#snippet error(x, y, size)}
    <polygon
        stroke-linejoin="round"
        stroke-linecap="round"
        stroke="red"
        stroke-widht="3"
        fill-opacity="0.8"
        fill="#aa0000"
        points="{size * x + size / 2} {size * y}
           {size * x + size} {size * y + size / 2}
           {size * x + size / 2} {size * y + size}
           {size * x} {size * y + size / 2}

           "
    ></polygon>
{/snippet}

<style>
    .canvas {
        max-width: 100%;
        height: 76vh;
        display: block;
        align-self: center;
        justify-self: center;
        width: 100%;
    }

    .choice-no {
        fill: #ff6666;
        stroke: #cc0000;
    }
    .choice-yes {
        fill: #66ff66;
        stroke: #00cc00;
    }
</style>
