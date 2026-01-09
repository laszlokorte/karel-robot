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
        executionError = atom(null),
        autoplaySpeed = atom(1),
        halted = atom(false),
        autoplay = atom(false),
        commandErrorCount = atom(0),
        executeLine,
        resetExecution,
        startExecution,
        pauseExecution,
    } = $props();
</script>

<div class="button-row">
    <button class="flow-button" type="button" onclick={resetExecution}
        >Reset
    </button>
    <button
        class="flow-button"
        type="button"
        onclick={executeLine}
        disabled={executionError.value ||
            halted.value ||
            commandErrorCount.value > 0 ||
            autoplay.value}
        >Step
    </button>
    <button
        class="flow-button"
        type="button"
        disabled={executionError.value || halted.value || autoplay.value}
        onclick={startExecution}
        >Play
    </button>
    <button
        class="flow-button"
        type="button"
        disabled={executionError.value || halted.value || !autoplay.value}
        onclick={pauseExecution}
        >Pause
    </button>
</div>

<label class="slider">
    <div>
        Playback Speed:
        <output>{autoplaySpeed.value}/s</output>
    </div>
    <input
        type="range"
        bind:value={autoplaySpeed.value}
        min="1"
        max="50"
        step="1"
    />
</label>

<style>
    .slider {
        flex-grow: 1;
        flex-basis: 10em;
        padding: 0 1ex;
        margin-left: auto;
        justify-self: end;
        align-self: end;
        white-space: nowrap;
    }

    .slider input {
        margin: 0;
        padding: 0;
        --accent-color: #399;
    }
    .button-row {
        display: flex;
        gap: 5px;
        padding: 2px;
    }
    .flow-button {
        border-radius: 8px;
        border-width: 2px;
        border-color: #399;
        background-color: #166;
    }
    .flow-button:hover {
        border-color: #4aa;
        background-color: #277;
    }
    .flow-button:active {
        border-color: #388;
        background-color: #266;
    }
    .flow-button:disabled {
        color: #fffa;
        border-color: #333;
        background-color: #444;
    }
    button {
        font: inherit;
        padding: 0.8ex;
        margin: 0;
        border: 1px solid #fff5;
    }
</style>
