<script>
    import * as L from "partial.lenses";
    import * as R from "ramda";
    import {
        atom,
        view,
        read,
        combine,
        combineWithRest,
        failableView,
        bindValue,
        bindScroll,
        bindScrollMax,
        bindSize,
        string,
    } from "./svatom.svelte.js";
    import Robot from "./Robot.svelte";
</script>

<Robot></Robot>

<style>
    @import url("app.css");
</style>
