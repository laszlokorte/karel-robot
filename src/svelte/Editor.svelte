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
        running = atom(false),
        commands = atom([]),
        currentLine = atom(null),
        halted = atom(false),
        allJumpTargets = atom([]),
        executionError = atom(null),
    } = $props();

    const executionErrorMessage = $derived(view("message", executionError));
    const executionErrorPosition = $derived(view("location", executionError));
    const executionErrorKind = $derived(view("kind", executionError));

    const executionErrorLine = $derived(view("command", executionError));
    const command = L.iso(
        (cmd) =>
            (cmd.indentSpaces || "") +
            (cmd.label ? `${cmd.label}:${cmd.labelSpace || ""}` : "") +
            (cmd.invalid
                ? `${cmd.invalid}${cmd.comment || ""}`
                : cmd.empty
                  ? `${cmd.empty}${cmd.comment || ""}`
                  : `${cmd.op || ""}${cmd.arg !== undefined ? ` ${cmd.arg}` : ""}${cmd.spaces || ""}${cmd.comment || ""}`),
        R.pipe(
            R.match(
                /(?<indentSpaces>\s*)(?:(?<label>[a-zA-Z]+):(?<labelSpace>\s*))?((?:(?<op>[a-zA-Z]+)(?: (?<arg>(?:@[a-zA-Z]*|[\+\-]?\d+)))?)(?<spaces>\s*)|(?<empty>\s*)|(?<invalid>[^#]+))(?<comment>#.*)?$/,
            ),
            R.prop("groups"),
        ),
    );

    const text = $derived(view(L.inverse(L.split("\n")), lines));
    const lines = $derived(
        view(
            [
                L.iso(
                    (array) => (array ? [...array, undefined] : [undefined]),
                    (array) =>
                        array.length == 0 ||
                        array[array.length - 1].empty == undefined ||
                        array[array.length - 1].empty != "" ||
                        array[array.length - 1].comment
                            ? array
                            : array.slice(0, -1),
                ),
                L.array([
                    L.defaults({
                        empty: "",
                    }),
                    command,
                ]),
            ],
            commands,
        ),
    );
</script>

<label
    class={{
        "line-numbered": true,
        disabled: running.value,
    }}
>
    <div class="line-numbers">
        {#each { length: lines.value.length } as _, l (l)}
            {@const c = commands.value[l] ?? {}}
            <span
                class={{
                    "line-number": true,

                    labeled: !!c.label,
                    active: currentLine.value == l,
                    error: executionErrorLine.value == l || !!c.error,
                    halted: halted.value,
                    targetted: allJumpTargets.value.includes(l),
                }}
            >
                {l}
            </span>
        {/each}
    </div>
    <div class="overlay">
        <div
            class={{
                faded: running.value,
                "overlay-layer": true,
                "overlay-annotations": true,
            }}
        >
            {#each commands.value as l}
                <span
                    class={{
                        annotation: true,
                        labeled: !!l.label,
                        empty: !!l.empty,
                        invalid: l.empty !== "" && (!!l.invalid || !!l.error),
                        valid: !(l.empty !== "" && (!!l.invalid || !!l.error)),
                    }}
                    >{l.indentSpaces || ""}{#if l.label}<span
                            class={{
                                "annotation-label": true,
                            }}>{l.label}:</span
                        >{l.labelSpace}
                    {/if}{#if l.empty !== undefined}
                        <span class="empty">{l.empty}</span><span
                            class="comment">{l.comment}</span
                        ><span>{" "}</span>
                    {:else if l.invalid}<span class="invalid"
                            >{l.invalid || " "}</span
                        ><span class="comment">{l.comment || ""}</span>
                    {:else}
                        <span
                            class={{
                                "annotation-body": true,
                                label: !!l.label,
                                empty: !!l.empty,
                                valid: !l.error,
                                invalid: l.error,
                            }}>{l.op || " "}</span
                        >{#if l.arg !== undefined}
                            <span class="spaces">{" "}</span><span
                                class={{
                                    "annotation-arg": true,
                                    "annotation-label": true,
                                    empty: !!l.empty,
                                    valid: !l.error,
                                    invalid: l.error,
                                }}
                                >{l.arg}<span
                                    class={{
                                        "annotation-extra": true,
                                        hidden: l.arg == l.numericArg,
                                    }}
                                    >&nbsp;(#{l.numericArg})
                                </span>
                            </span>
                        {/if}<span class="spaces">{l.spaces || ""}</span><span
                            class="comment">{l.comment || ""}</span
                        ><span>{" "}</span>
                    {/if}
                </span>
            {/each}
        </div>
        <div
            style="z-index: 100; pointer-events: none;"
            class={{
                "overlay-layer": true,
                "overlay-annotations": true,
                "annoatation-right": true,
            }}
        >
            {#each commands.value as l, li}
                <span
                    style="background: none;"
                    class={{
                        annotation: true,
                    }}
                >
                    <span style="color: transparent; background: none">
                        {l.indentSpaces || ""}{#if l.label}<span
                                >{l.label}:</span
                            >{l.labelSpace}
                        {/if}{#if l.empty !== undefined}<span>{l.empty}</span
                            ><span>{l.comment}</span>{:else if l.invalid}<span
                                >{l.invalid || ""}</span
                            ><span>{l.comment || ""}</span>{:else}<span
                                class={{}}
                                >{l.op || " "}{l.arg !== undefined
                                    ? " " + l.arg
                                    : ""}</span
                            ><span>{l.spaces || ""}</span><span
                                >{l.comment || ""}</span
                            >
                        {/if}</span
                    >
                    {#if l.invalid}<span>{" - "}</span><span class="inlay error"
                            >Invalid syntax</span
                        >{:else if !!l.error}<span>{" - "}</span><label
                            class="inlay error"
                            ><input type="checkbox" />{l.error}</label
                        >{/if}
                    {#if executionErrorLine.value === li}
                        <label class="inlay error">
                            <input
                                type="checkbox"
                            />{executionErrorMessage.value}</label
                        >
                    {/if}
                </span>
            {/each}
            <span
                style="background: none;"
                class={{
                    annotation: true,
                }}
            >
                {#if executionErrorLine.value === commands.value.length}
                    <span class="inlay error"
                        >{executionErrorMessage.value}</span
                    >
                {/if}
            </span>
        </div>
        <textarea
            cols="0"
            rows="0"
            use:bindValue={text}
            autocomplete="off"
            autocorrect="off"
            autocapitalize="off"
            spellcheck="false"
            readonly={running.value}
            class={{
                hidden: running.value,
                "overlay-layer": true,
                "overlay-input": true,
            }}
        ></textarea>
    </div>
</label>

<style>
    .overlay {
        display: grid;
        grid-template-columns: 1fr;
        grid-template-rows: 1fr;
        justify-content: stretch;
        align-content: stretch;

        padding: 1ex 0;
        background-color: #fff3;
        word-spacing: 3px;
        letter-spacing: 1px;
    }

    .overlay-layer {
        grid-area: 1 / 1 / -1 / -1;
        resize: none;
    }
    .overlay-layer.faded .annotation-body {
        background-color: #ff000055;
        border-color: transparent;
    }
    .overlay-layer.faded .annotation-body.valid {
        background-color: #0844;
        outline: 1px solid #0a68;
    }
    .overlay-layer.faded .annotation-body.valid.label {
        background-color: #aa00ff44;
        outline: 1px solid #cc00ff88;
    }
    .overlay-layer.faded .annotation {
        color: inherit;
    }
    .annotation-extra {
        display: none;
    }

    .annotation.labeled:not(.invalid) {
        background-color: #aa00ff44;
    }

    .overlay-layer.faded .annotation-extra {
        display: inline;
    }

    .overlay-annotations {
        z-index: 10;
        display: flex;
        flex-direction: column;
        white-space: pre;
    }
    .annotation {
        display: inline;
        position: relative;
        color: transparent;
        padding-left: 1ex;
        letter-spacing: inherit;
        word-spacing: inherit;
    }

    .annotation-body:not(.empty) {
        background-color: none;
        padding: 2px 3px;
        margin-left: -3px;
        margin-right: -3px;
        border-radius: 3px;
        outline-offset: -1px;
        z-index: 10;
        position: relative;
    }
    .annotation-body.valid {
        background-color: #00ff0033;
        outline: 1px solid #00cc00;
    }

    .annotation-body.invalid {
        background-color: #ff000033;
        outline: 1px solid #cc0000;
    }

    .annotation-label {
        background-color: #ff00aa33;
        outline: 1px solid #cc00cc;
        padding: 2px 3px;
        margin-left: -3px;
        margin-right: -3px;
        border-radius: 3px;
        outline-offset: -1px;
        z-index: 10;
        position: relative;
    }
    .annotation-arg {
        background-color: #aa00ff33;
        outline: 1px solid #cc00ff;
    }

    .overlay-input {
        z-index: 20;
        font: inherit;
        padding: 0;
        padding-left: 1ex;
        border: none;
        margin: 0;
        outline: none;
        width: 100%;
        height: 100%;
        min-width: 0;
        min-height: 0;
        max-width: none;
        max-height: none;
        line-height: inherit;
        background-color: transparent;
        color: inherit;
        white-space: pre;
        letter-spacing: inherit;
        word-spacing: inherit;
    }

    .line-numbers {
        display: flex;
        flex-direction: column;
        align-items: stretch;
        position: sticky;
        left: 0;
        background-color: inherit;
        z-index: 100;
        padding: 1ex;
        line-height: inherit;
    }

    .line-number {
        text-align: right;
        min-width: 2em;
        padding-right: 1ex;
        color: #aaa;
        border-right: 3px solid transparent;
    }
    .line-number.active {
        background: aquamarine;
        color: #000;
    }

    .line-number.active.halted {
        background: goldenrod;
        color: #000;
    }
    .line-number.labeled {
        border-color: #cc00aa;
    }

    .line-number.error {
        background: palevioletred;
        color: #000;
    }
    .line-number.active.error {
        outline: 2px solid aquamarine;
    }
    /* .line-number.targetted {
            text-decoration: underline;
            text-decoration-color: #cc00aa;
            }*/

    .line-numbered {
        display: grid;
        grid-template-columns: auto 1fr;
        gap: 1ex;
        font-family: monospace;
        font-size: 1.2em;
        background-color: #333;
        color: #fff;
        line-height: 1.75;
        border: 4px solid transparent;
        position: relative;
        overflow: auto;
    }
    .line-numbered:not(.disabled):has(:focus-visible) {
        border-color: #0c8;
    }
    .line-numbered.disabled:has(:focus-visible) {
        border-color: gray;
    }

    .comment {
        background-color: gray;
        z-index: 10;
        position: relative;
    }
    .comment:not(:empty) {
        border-radius: 4px;
        padding: 2px 3px;
        margin-left: -3px;
        margin-right: -3px;
    }
    .invalid {
        background-color: #500;
    }
    .line-number.error {
        text-decoration: underline;
        text-decoration-style: wavy;
        text-decoration-color: transparent;
    }
    .inlay {
        z-index: 100;
        color: #ffeeee;
        background-color: #550000;
        outline: 1px solid #ffaaaa;
        border-radius: 3px;
        padding: 0.3ex 1ex;
        border: none;
        font-size: 0.8em;
        font-style: italic;
        vertical-align: middle;
        margin-left: auto;
        position: sticky;
        margin-right: -1ex;
        right: 2ex;
        box-sizing: border-box;
        pointer-events: all;
    }
    .inlay > input {
        display: none;
    }
    .inlay:has(> input) {
        cursor: pointer;
    }
    .inlay:has(> :checked) {
        display: inline-flex;
        vertical-align: text-top;
        margin: 0;
        height: 1.4em;
        overflow: hidden;
        width: 1.4em;
        padding: 0;
        border-radius: 100%;
        color: transparent;
        text-align: center;
        justify-content: start;
        align-items: center;
        text-align: center;
        flex-direction: column;
        line-height: 1.6em;
        outline: none;
    }
    .inlay::before {
        content: "❌";
        font-weight: bold;
        color: #faa;
        font-style: normal;
        letter-spacing: 1ex;
        vertical-align: baseline;
    }
    .inlay:has(> :checked)::before {
        font-size: 1.4em;
        letter-spacing: 0;
    }
    .annoatation-right {
        text-align: right;
    }
</style>
