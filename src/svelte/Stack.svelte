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
        error = atom(false),
        stack = atom([]),
        disabled = atom(false),
    } = $props();
</script>

<div
    class={{
        "stack-container": true,
        error: error.value,
    }}
>
    <h3 class="stack-head">
        Bookmark<br /> Stack:
    </h3>
    <ol class="stack-body">
        {#if disabled.value}
            <li class="stack-empty">Empty</li>
        {:else}
            {#each stack.value as s}
                <li class="stack-item">
                    {s}
                </li>
            {:else}
                <li class="stack-empty">Empty</li>
            {/each}
        {/if}
    </ol>
</div>

<style>
    .stack-container {
        margin-bottom: auto;
        padding: 1ex;
        flex-basis: 2em;
        display: flex;
        align-items: stretch;
        gap: 1ex;
        justify-content: space-between;
    }
    .stack-container.error {
        color: #a00;

        & .stack-body {
            border-color: #a00;
        }
        & .stack-head {
            background-color: #a00;
            color: #fff;
        }
    }
    .stack-head {
        text-align: right;
        font-size: 1em;
        margin: 0;
        padding: 0 2ex 0 1ex;
        display: flex;
        align-items: center;
        font-family: monospace;
        background-color: #eee;
        border-radius: 8px;
    }
    .stack-body {
        flex-grow: 1;
        display: flex;
        list-style: none;
        margin: 0;
        padding: 0;
        border: 1px solid #ccc;
        gap: 0.5ex;
        padding: 0.5ex;
        border-left: 0;
        justify-content: end;
        border-radius: 5px;
        counter-reset: stacksize;
        position: relative;
    }
    .stack-item {
        padding: 1ex;
        border: 1px solid gray;
        box-sizing: border-box;
        flex-shrink: 1;
        text-align: center;
        max-width: 5em;
        font-family: monospace;
        border-radius: 4px;
        counter-increment: stacksize;
    }
    .stack-body:has(.stack-item:nth-child(8))::after {
        opacity: 0.5;
        font-size: 0.8em;
        display: flex;
        align-items: center;
        content: "(" counter(stacksize) " more...)";
        white-space: nowrap;
        padding: 1ex;
        border: 1px dashed gray;
        box-sizing: border-box;
        flex-shrink: 1;
        font-family: monospace;
        border-radius: 4px;
        text-align: center;
        justify-content: center;
        flex-grow: 1;
    }
    .stack-item:nth-child(n + 8) {
        visibility: hidden;
        width: 0;
        flex-grow: 0;
        display: block;
        overflow: hidden;
        position: absolute;
        right: 0;
    }
    .stack-empty {
        padding: 1ex;
        font-style: italic;
        border: 1px solid transparent;
        font-family: monospace;
    }
</style>
