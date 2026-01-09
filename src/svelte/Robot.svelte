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
    import Split from "./Split.svelte";
    import * as predefined from "./levels.js";
    import { levels, solutions } from "./levels/index.js";
    import Editor from "./Editor.svelte";
    import Stepper from "./Stepper.svelte";
    import World from "./World.svelte";
    import Stack from "./Stack.svelte";
    import Help from "./Help.svelte";

    const {
        allLevels = atom(levels),
        allSolutions = atom(solutions),
        storedCommands = storedAtom("commands"),
        storedSettings = storedAtom("settings", false),
        world = atom({
            dirty: false,
            started: false,
            running: false,
            halted: false,
            error: null,
            level: {
                size: { x: 10, y: 10 },
                start: { x: 5, y: 5 },
                walls: Array(10 * 10).fill(false),
                crystals: Array(10 * 10).fill(false),
            },
            original: {
                size: { x: 10, y: 10 },
                start: { x: 5, y: 5 },
                walls: Array(10 * 10).fill(false),
                crystals: Array(10 * 10).fill(false),
                digits: Array(10 * 10).fill(false),
            },
            player: {
                pos: { x: 0, y: 0 },
                dir: { x: 0, y: 1 },
            },
            choice: null,
            program: {
                next: 0,
                commands: [],
            },
            stack: [],
        }),
    } = $props();
    const resolution = 32;
    const allCommands = $derived(view(L.json(), storedCommands));
    const allSettings = $derived(view(L.json(), storedSettings));
    const showHelp = $derived(view("showHelp", allSettings));
    const showGoalText = $derived(
        view(["showGoalText", L.valueOr(false)], allSettings),
    );
    const autoplaySpeed = $derived(view("autoplaySpeed", allSettings));
    const levelKey = $derived(
        view(["levelKey", L.valueOr(levels[0].id)], allSettings),
    );

    const goal = atom(true);
    const validateCommands = (cmds) => {
        const labelMap = {};
        let i = 0;
        for (let c of cmds) {
            if (c.label) {
                if (labelMap[c.label] !== undefined) {
                    labelMap[c.label] = -1;
                } else {
                    labelMap[c.label] = i;
                }
            }
            i++;
        }
        return cmds
            .map((c) => {
                if (c.label && labelMap[c.label] === -1) {
                    return {
                        ...c,
                        error: { kind: "label", msg: "duplicate label" },
                    };
                }
                if (c.arg) {
                    if (c.arg[0] === "@") {
                        const label = c.arg.slice(1).trim();
                        if (!label) {
                            return {
                                ...c,
                                error: {
                                    kind: "label",
                                    msg: "Label must not be empty",
                                },
                            };
                        }
                        if (labelMap[label] >= 0) {
                            return {
                                ...c,
                                numericArg: labelMap[label],
                            };
                        } else if (labelMap[label] === -1) {
                            return {
                                ...c,
                                error: {
                                    kind: "label",
                                    msg: `Label is defined multiple times`,
                                },
                            };
                        }
                        {
                            return {
                                ...c,
                                error: {
                                    kind: "arg",
                                    msg: `Unknown label @${label}`,
                                },
                            };
                        }
                    } else {
                        return {
                            ...c,
                            numericArg: parseInt(c.arg, 10),
                        };
                    }
                }
                return c;
            })
            .map((x, i) => {
                const validOp =
                    x.empty !== undefined || validateOp(x.op, x.arg);
                if (validOp.error) {
                    return { ...x, error: validOp.error };
                } else if (x.error) {
                    return x;
                } else if (
                    !R.all(
                        (jt) => jt === false || (jt >= 0 && jt < cmds.length),
                        jumpTargets(x, i),
                    )
                ) {
                    return {
                        ...x,
                        error: {
                            kind: "arg",
                            msg: `Jump target (${jumpTargets(x, i).join(", ")}) outside range`,
                        },
                    };
                }
                return x;
            });
    };
    const currentCommands = $derived(
        view(
            [
                L.choose(({ levelKey }) => [
                    "allCommands",
                    L.valueOr([]),
                    L.find(R.whereEq({ level: levelKey })),
                    L.valueOr({
                        level: levelKey,
                    }),
                    "commands",
                    L.valueOr([]),
                    L.reread(validateCommands),
                ]),
            ],
            combine({ allCommands, levelKey }),
        ),
    );
    const currentLine = $derived(view(["program", "next"], world));
    const commandErrorCount = $derived(
        view(
            L.reread((commands) => {
                return R.count(
                    (cmd) => cmd.empty === undefined && cmd.error,
                    commands,
                );
            }),
            currentCommands,
        ),
    );

    const commandsToRun = $derived(
        view(
            L.choose(({ goal }) => (goal ? "currentGoal" : "currentCommands")),
            combine({
                currentCommands,
                currentGoal,
                goal,
            }),
        ),
    );

    function jumpTargets(c, ci) {
        switch (c.op) {
            case "ifYesJumpTo":
                return [c.numericArg];
            case "ifNotJumpTo":
                return [c.numericArg];
            case "jumpTo":
                return [c.numericArg];
            case "ifYesJumpBy":
                return [ci + c.numericArg];
            case "ifNotJumpBy":
                return [ci + c.numericArg];
            case "jumpBy":
                return [ci + c.numericArg];
            case "bookmarkAndJump":
                return [ci + 1, c.numericArg];
            case "bookmark":
                return [ci + 2];
        }
        return [];
    }
    const allJumpTargets = $derived(
        view(
            L.reread((commands) => {
                return commands.flatMap((c, ci) => {
                    return jumpTargets(c, ci);
                });
            }),
            currentCommands,
        ),
    );
    const currentLevel = $derived(
        view(
            L.choose(({ levelKey }) => [
                "allLevels",
                L.valueOr([]),
                L.whereEq({ id: levelKey }),
                "level",
                L.valueOr({
                    gen: () => ({
                        size: { x: 10, y: 10 },
                        start: { x: 5, y: 5 },
                        walls: Array(10 * 10).fill(false),
                        crystals: Array(10 * 10).fill(false),
                        digits: Array(10 * 10).fill(false),
                    }),
                }),
                L.lens(
                    (gen) => ({
                        ...gen(),
                        gen: gen,
                    }),
                    (x) => () => ({
                        size: x.size,
                        start: x.start,
                        walls: x.walls,
                        crystals: x.crystals,
                        digits: x.digits,
                    }),
                ),
            ]),
            combine({ allLevels, levelKey }),
        ),
    );
    const currentGoal = $derived(
        view(
            L.choose(({ levelKey }) => [
                "allSolutions",
                L.valueOr([]),
                L.whereEq({ level: levelKey }),
                "commands",
                L.valueOr([]),
                L.reread(validateCommands),
            ]),
            combine({ allSolutions, levelKey }),
        ),
    );

    const level = $derived(view("level", world));
    const player = $derived(view("player", world));
    const choice = $derived(view("choice", world));
    const halted = $derived(view("halted", world));
    const stack = $derived(view("stack", world));
    const program = $derived(view("program", world));
    const running = $derived(view("running", world));
    const started = $derived(view("started", world));
    const autoplay = $derived(view("autoplay", world));
    const hideStack = $derived(
        view(
            L.reread(({ goal, running }) => goal || !running),
            combine({ goal, running }),
        ),
    );
    const autoplayDelay = $derived(
        view(
            [
                L.iso(
                    (x) => 1000 / x,
                    (x) => 1000 / x,
                ),
            ],
            autoplaySpeed,
        ),
    );
    const editorRunning = $derived(
        view(
            L.choose(({ cond }) => (cond ? L.zero : "guarded")),
            combine({ cond: goal, guarded: running }),
        ),
    );

    const editorCurrentLine = $derived(
        view(
            L.choose(({ cond }) => (cond ? L.zero : "guarded")),
            combine({ cond: goal, guarded: currentLine }),
        ),
    );
    const editorHalted = $derived(
        view(
            L.choose(({ cond }) => (cond ? L.zero : "guarded")),
            combine({ cond: goal, guarded: halted }),
        ),
    );
    $effect(() => {
        if (autoplay.value && running.value && !halted.value) {
            const frame = () => {
                executeLine();
                raf = window.setTimeout(frame, autoplayDelay.value);
            };
            let raf = window.setTimeout(frame, autoplayDelay.value);

            return () => window.clearTimeout(raf);
        }
    });

    const currentChoiceYesNo = $derived(
        view(
            [
                "choice",
                L.lens(
                    (r) => (r ? "yes" : "no"),
                    (r) => r === "yes",
                ),
            ],
            world,
        ),
    );
    const executionError = $derived(view("error", world));

    function reloadLevel(init, randomize, showGoal) {
        if (showGoal) {
            goal.value = true;
        }
        const cmds = commandsToRun.value;
        update((w) => {
            const lvl = randomize ? currentLevel.value.gen() : w.original;

            return {
                ...w,
                dirty: false,
                running: init,
                started: false,
                autoplay: false,
                error: null,
                program: {
                    next: init ? 0 : -1,
                    commands: cmds,
                },
                original: lvl,
                level: {
                    size: lvl.size,
                    crystals: lvl.crystals,
                    digits: lvl.digits,
                    walls: lvl.walls,
                    start: lvl.start,
                },
                player: {
                    pos: {
                        x: lvl.start.x,
                        y: lvl.start.y,
                    },
                    dir: { x: 1, y: 0 },
                },
                choice: null,
                halted: null,
                stack: [],
            };
        }, world);
    }

    reloadLevel(true, true, true);
    const commandsJson = $derived(
        view(L.inverse(L.json({ space: "  " })), currentCommands),
    );
    const levelJson = $derived(
        view([L.inverse(L.json({ space: "  " }))], currentLevel),
    );
    const levelError = atom();
    const currentLevelText = $derived(
        failableView(
            [
                L.iso(
                    ({ size, walls, crystals, start }) =>
                        Array(size.y)
                            .fill(size.x)
                            .map((xs, y) =>
                                Array(xs)
                                    .fill(null)
                                    .map((_, x) => {
                                        if (start.x === x && start.y === y) {
                                            return "s";
                                        } else if (walls[y * xs + x]) {
                                            return "x";
                                        } else if (crystals[y * xs + x]) {
                                            return "*";
                                        } else {
                                            return ".";
                                        }
                                    })
                                    .join(""),
                            )
                            .join("\n"),

                    (text) => {
                        const lines = text.split("\n");
                        const maxWidth = lines.reduce(
                            (acc, l) => Math.max(acc, l.length),
                            0,
                        );
                        const minWidth = lines.reduce(
                            (acc, l) => Math.min(acc, l.length),
                            Infinity,
                        );
                        if (maxWidth !== minWidth) {
                            return new Error(
                                "invalid size " + maxWidth + ", " + minWidth,
                            );
                        }
                        const width = maxWidth;
                        const startIndex = text.indexOf("s");
                        if (startIndex < 0) {
                            return new Error("missing start position");
                        }
                        return {
                            size: { y: lines.length, x: width },
                            start: {
                                y: Math.floor(startIndex / (width + 1)),
                                x: startIndex % (width + 1),
                            },
                            walls: Array(lines.length * width)
                                .fill(false)
                                .map((def, i) => {
                                    const x = i % width;
                                    const y = Math.floor(i / width);

                                    return lines[y].slice(x, x + 1) === "x";
                                }),
                            crystals: Array(lines.length * width)
                                .fill(false)
                                .map((def, i) => {
                                    const x = i % width;
                                    const y = Math.floor(i / width);

                                    return lines[y].slice(x, x + 1) === "*";
                                }),
                        };
                    },
                ),
                L.setter((t, oldText) => {
                    const changedLine = Math.max(
                        0,
                        R.findIndex(
                            R.identity,
                            R.zipWith(
                                (a, b) => {
                                    return Math.abs(a.length - b.length) == 1;
                                },
                                t.split("\n"),
                                oldText.split("\n"),
                            ),
                        ),
                    );
                    const changedColumn = R.findIndex(
                        R.identity,
                        R.zipWith(
                            (a, b) => {
                                return a != b;
                            },
                            t.split("\n")[changedLine].split(""),
                            oldText.split("\n")[changedLine].split(""),
                        ),
                    );
                    const lines = t.split("\n");
                    const maxWidth =
                        changedColumn < 0
                            ? lines[changedLine].length
                            : oldText.split("\n")[0].length;
                    return lines
                        .map((l, _i, all) => {
                            return (
                                l + Array(maxWidth).fill(".").join("")
                            ).slice(0, maxWidth);
                        })
                        .join("\n");
                }),
            ],
            currentLevel,
            false,
            levelError,
        ),
    );
    function validateOp(op, arg) {
        if (
            ![
                "turnLeft",
                "turnRight",
                "turnAround",
                "forward",
                "pick",
                "drop",
                "checkWallAhead",
                "checkWallLeft",
                "checkWallRight",
                "checkBeeperAhead",
                "checkBeeper",
                "ifYesJumpTo",
                "ifNotJumpTo",
                "jumpTo",
                "ifYesJumpBy",
                "ifNotJumpBy",
                "jumpBy",
                "halt",
                "bookmark",
                "return",
                "bookmarkAndJump",
            ].includes(op)
        ) {
            return { error: { kind: "command", msg: "unknown command" } };
        }
        if (
            [
                "ifYesJumpTo",
                "ifNotJumpTo",
                "jumpTo",
                "ifYesJumpBy",
                "ifNotJumpBy",
                "jumpBy",
                "bookmarkAndJump",
            ].includes(op) &&
            undefined === arg
        ) {
            return { error: { kind: "arg", msg: "missing argument" } };
        }
        if (
            ![
                "ifYesJumpTo",
                "ifNotJumpTo",
                "jumpTo",
                "ifYesJumpBy",
                "ifNotJumpBy",
                "jumpBy",
                "bookmarkAndJump",
            ].includes(op) &&
            undefined !== arg
        ) {
            return { error: { kind: "arg", msg: "unexpected argument" } };
        }

        const argIsLabel = arg && arg[0] === "@";
        const argIsNum = arg && arg[0] !== "@";
        if (
            [
                "ifYesJumpTo",
                "ifNotJumpTo",
                "jumpTo",
                "bookmarkAndJump",
            ].includes(op) &&
            !argIsLabel
        ) {
            return {
                error: { kind: "arg", msg: "Expect argument to be a @label" },
            };
        }
        if (
            ["ifYesJumpBy", "ifNotJumpBy", "jumpBy"].includes(op) &&
            !argIsNum
        ) {
            return {
                error: { kind: "arg", msg: "Expect argument to be a number" },
            };
        }
        return true;
    }

    function runPlayerOp(op, player) {
        switch (op.op) {
            case "turnRight":
                return {
                    player: {
                        ...player,
                        dir: { x: -player.dir.y, y: player.dir.x },
                    },
                };
            case "turnLeft":
                return {
                    player: {
                        ...player,
                        dir: { x: player.dir.y, y: -player.dir.x },
                    },
                };
            case "turnAround":
                return {
                    player: {
                        ...player,
                        dir: { x: -player.dir.x, y: -player.dir.y },
                    },
                };
            case "forward":
                return {
                    player: {
                        ...player,
                        pos: {
                            x: player.pos.x + player.dir.x,
                            y: player.pos.y + player.dir.y,
                        },
                    },
                };
        }
        return { player: player };
    }
    function runLevelOp(op, cell) {
        switch (op.op) {
            case "pick":
                if (!cell) {
                    return { error: "There is no crystal to pick" };
                }
                return { newCell: false };
            case "drop":
                if (cell) {
                    return { error: "There is is already a crystal" };
                }
                return { newCell: true };
        }
        return { newCell: cell };
    }

    function runChoiceOp(op, player, level) {
        switch (op.op) {
            case "checkWallAhead": {
                const frontPos = {
                    x: player.pos.x + player.dir.x,
                    y: player.pos.y + player.dir.y,
                };
                return (
                    frontPos.y == -1 ||
                    frontPos.y == level.size.y ||
                    frontPos.x == -1 ||
                    frontPos.x == level.size.x ||
                    level.walls[frontPos.x + frontPos.y * level.size.x] === true
                );
            }
            case "checkWallRight": {
                const sidePos = {
                    x: player.pos.x - player.dir.y,
                    y: player.pos.y + player.dir.x,
                };
                return (
                    sidePos.y == -1 ||
                    sidePos.y == level.size.y ||
                    sidePos.x == -1 ||
                    sidePos.x == level.size.x ||
                    level.walls[sidePos.x + sidePos.y * level.size.x] === true
                );
            }
            case "checkWallLeft": {
                const sidePos = {
                    x: player.pos.x + player.dir.y,
                    y: player.pos.y - player.dir.x,
                };
                return (
                    sidePos.y == -1 ||
                    sidePos.y == level.size.y ||
                    sidePos.x == -1 ||
                    sidePos.x == level.size.x ||
                    level.walls[sidePos.x + sidePos.y * level.size.x] === true
                );
            }
            case "checkBeeperAhead": {
                const frontPos = {
                    x: player.pos.x + player.dir.x,
                    y: player.pos.y + player.dir.y,
                };
                if (
                    frontPos.y == -1 ||
                    frontPos.y == level.size.y ||
                    frontPos.x == -1 ||
                    frontPos.x == level.size.x
                ) {
                    return false;
                }
                return (
                    level.crystals[frontPos.x + frontPos.y * level.size.x] ===
                    true
                );
            }
            case "checkBeeper":
                return (
                    level.crystals[
                        player.pos.x + player.pos.y * level.size.x
                    ] === true
                );
        }
        return null;
    }
    function runConrolOp(op, line, choice, stack) {
        switch (op.op) {
            case "bookmark":
                if (stack.length > 12) {
                    return {
                        error: "To many bookmarks (Stack overflow)",
                        kind: "stack ",
                    };
                }
                return { line: line + 1, stack: [line + 2, ...stack] };
            case "bookmarkAndJump":
                if (stack.length > 200) {
                    return {
                        error: "Too many bookmarks (Stack overflow)",
                        kind: "stack",
                    };
                }
                return { line: op.numericArg, stack: [line + 1, ...stack] };
            case "return":
                if (!stack.length) {
                    return { error: "No bookmark to return to", kind: "stack" };
                }
                return { line: stack[0], stack: stack.slice(1) };
            case "halt":
                return { line, halt: true, stack };
            case "ifYesJumpTo":
                if (choice === true) {
                    return {
                        line: op.numericArg,
                        stack,
                    };
                } else if (choice === false) {
                    return { line: line + 1, stack };
                } else {
                    return {
                        error: "Conditional jump needs condition to be checked first",
                        kind: "choice",
                    };
                }
            case "ifNotJumpTo":
                if (choice === false) {
                    return {
                        line: op.numericArg,
                        stack,
                    };
                } else if (choice === true) {
                    return { line: line + 1, stack };
                } else {
                    return {
                        error: "Conditional jump needs condition to be checked first",
                        kind: "choice",
                    };
                }
            case "jumpTo":
                return {
                    line: op.numericArg,
                    stack,
                };
            case "ifYesJumpBy":
                if (choice === true) {
                    return {
                        line: line + op.numericArg,
                        stack,
                    };
                } else if (choice === false) {
                    return { line: line + 1, stack };
                }
            case "ifNotJumpBy":
                if (choice === false) {
                    return {
                        line: line + op.numericArg,
                        stack,
                    };
                } else if (choice === true) {
                    return { line: line + 1, stack };
                } else {
                    return {
                        error: "Conditional jump needs condition to be checked first",
                        kind: "choice",
                    };
                }
            case "jumpBy":
                return {
                    line: line + op.numericArg,
                    stack,
                };
        }
        if (choice !== null) {
            return { error: "must jump after check", kind: "choice" };
        }
        return {
            line: line + 1,
            stack,
        };
    }
    function runOp(op, level, player, line, choice, stack) {
        if (op.op === undefined) {
            return {
                player: player,
                choice: choice,
                level: level,
                stack,
                next: line + 1,
                empty: true,
            };
        }
        const validatedOp = validateOp(op.op, op.arg);
        if (validatedOp.error) {
            return { error: validatedOp.error.msg, errorKind: "operation" };
        }
        const newPlayerResult = runPlayerOp(op, player);
        if (newPlayerResult.player) {
            const newPlayer = newPlayerResult.player;

            if (newPlayer.pos.x >= level.size.x || newPlayer.pos.x < 0) {
                return { error: "Player hit a wall", errorKind: "world" };
            }
            if (newPlayer.pos.y >= level.size.y || newPlayer.pos.y < 0) {
                return { error: "Player hit a wall", errorKind: "world" };
            }
            if (level.walls[newPlayer.pos.x + newPlayer.pos.y * level.size.x]) {
                return { error: "Player hit a wall", errorKind: "world" };
            }

            const newLevel = {
                ...level,
                crystals: level.crystals.reduce((acc, c, i) => {
                    if (acc.error) {
                        return acc;
                    }
                    if (
                        i ===
                        newPlayer.pos.x + newPlayer.pos.y * level.size.x
                    ) {
                        const result = runLevelOp(op, c);
                        if (result.error) {
                            return result;
                        }

                        return [result.newCell, ...acc];
                    } else {
                        return [c, ...acc];
                    }
                }, []),
                next: line,
            };
            if (newLevel.crystals.error) {
                return { error: newLevel.crystals.error, errorKind: "world" };
            }

            const nextControl = runConrolOp(op, line, choice, stack);

            if (nextControl.error) {
                return {
                    error: nextControl.error,
                    errorKind: nextControl.kind,
                };
            }
            return {
                player: newPlayer,
                choice: runChoiceOp(op, player, level),
                level: {
                    ...level,
                    crystals: newLevel.crystals.reverse(),
                },
                next: nextControl.line,
                stack: nextControl.stack,
                halt: !!nextControl.halt,
            };
        } else {
            return { error: newPlayerResult.error };
        }
    }
    function startExecution() {
        autoplay.value = true;
    }
    function pauseExecution() {
        autoplay.value = false;
    }

    function beginGoal() {
        reloadLevel(true, false, true);
    }
    function beginEdit() {
        goal.value = false;
        reloadLevel(false);
    }
    function beginExecute() {
        goal.value = false;
        reloadLevel(true, false);
    }
    function resetExecution(loadGoal) {
        reloadLevel(true, false);
    }

    const executionStep = ({
        program: { next },
        player,
        commands,
        level,
        choice,
        error,
        halted,
        running,
        stack,
        autoplay,
    }) => {
        if (halted) {
            return {
                program: { next },
                player: player,
                level: level,
                choice: choice,
                error: error,
                running: running,
                halted: halted,
                started: started,
                autoplay: false,
            };
        }
        if (next == commands.length) {
            return {
                error: {
                    message: `End of program reached`,
                    command: next,
                },
                program: { next },
                player: player,
                level: level,
                stack: stack,
                running: true,
                started: true,
                autoplay: false,
            };
        }
        if (next < commands.length) {
            const result = runOp(
                commands[next],
                level,
                player,
                next,
                choice,
                stack,
            );
            if (result.error) {
                return {
                    error: {
                        message: result.error,
                        command: next,
                        location: player,
                        kind: result.errorKind,
                    },
                    program: { next },
                    player: player,
                    level: level,
                    stack: stack,
                    running: running,
                    started: true,
                    autoplay: false,
                };
            } else {
                if (result.next < 0 || result.next > commands.length) {
                    return {
                        error: {
                            message: `Can not jump to line ${result.next}`,
                            command: next,
                        },
                        program: { next },
                        player: player,
                        level: level,
                        stack: stack,
                        running: false,
                        started: true,
                        autoplay: false,
                    };
                }

                return {
                    program: { next: result.next },
                    player: result.player,
                    level: result.level,
                    choice: result.choice,
                    error: null,
                    stack: result.stack,
                    running: true,
                    halted: result.halt,
                    started: true,
                    autoplay: autoplay && !result.halt,
                };
            }
        } else {
            return {
                program: { next: commands.length },
                player,
                level,
                choice,
                stack,
                error: null,
                running: false,
                started: true,
                autoplay: false,
            };
        }
    };
    function executeLine() {
        update(
            (state) => {
                const commands = state.program.commands;
                do {
                    state = executionStep({ commands, ...state });
                } while (
                    !state.halt &&
                    !state.error &&
                    goal.value &&
                    ![
                        "forward",
                        "turnLeft",
                        "turnRight",
                        "turnAround",
                        "pick",
                        "drop",
                        "halt",
                    ].includes(commands[state.program.next].op)
                );
                return { ...state, program: { ...state.program, commands } };
            },
            combine(
                {
                    program,
                    player,
                    choice,
                    level,
                    error: executionError,
                    running,
                    started,
                    halted,
                    stack,
                    autoplay,
                },
                {
                    program: true,
                    player: true,
                    choice: true,
                    commands: false,
                    level: true,
                    error: true,
                    running: true,
                    started: true,
                    halted: true,
                    stack: true,
                    autoplay: false,
                },
            ),
        );
    }
</script>

<div class="container">
    <div class="controls">
        <h1>
            <img src="favicon.svg" alt="[Icon]" />
            Caroline The Robot
            <span>(<abbr title="Work in Progress">WIP</abbr>)</span>
        </h1>
        <div class="button-row">
            <label>
                Level: <select
                    bind:value={levelKey.value}
                    onchange={() => reloadLevel(true, true, true)}
                >
                    {#each allLevels.value as l, li (l.id)}
                        <option value={l.id} selected={levelKey.value === l.id}
                            >{li + 1}. {l.name}</option
                        >
                    {/each}
                </select>
            </label>

            <button
                class="level-button"
                onclick={(evt) => {
                    reloadLevel(true, true, false);
                }}>Reload</button
            >
        </div>
    </div>
    <div
        style="display: none; grid-template-columns: 1fr 1fr 1fr; border: 2px solid gray; border-bottom: none; box-sizing: border-box;gap: 1ex; padding: 1ex;"
    >
        <div
            style="display: grid; grid-template-rows: 1fr auto; box-sizing: border-box; "
        >
            <textarea
                style="font-family: monospace; align-self: stretch; resize: none;  box-sizing: border-box; width: auto; overflow: auto;
            white-space: pre;
            "
                use:bindValue={currentLevelText}
            ></textarea>
            <div
                style="background-color: #fee; align-items: center;gap: 1em;overflow: auto;"
                style:display={levelError.value ? "flex" : "none"}
            >
                <button
                    onclick={() => {
                        update((t) => {
                            const lines = t.trim().split("\n");
                            const maxWidth = lines[0].length;
                            return lines
                                .map((l, _i, all) => {
                                    return (
                                        l + Array(maxWidth).fill(".").join("")
                                    ).slice(0, maxWidth);
                                })
                                .join("\n");
                        }, currentLevelText);
                    }}>auto fix</button
                >

                {levelError.value}
            </div>
        </div>
        <textarea
            style="overflow: auto; height: 10em; font-family: monospace;"
            readonly={true}>{commandsJson.value}</textarea
        >

        <textarea
            style="overflow: auto; height: 10em; font-family: monospace;"
            readonly={true}>{levelJson.value}</textarea
        >
    </div>

    <div class="robot-container">
        <Split
            content={atom([
                { size: 30, content: "x" },
                { size: 30, content: "y" },
            ])}
        >
            {#snippet children(i)}
                {#if i == 1}
                    <div class="editor">
                        <div class="toolbar">
                            <div class="toggle-buttons">
                                <button
                                    type="button"
                                    class={{
                                        "toggle-button": true,
                                        active: goal.value,
                                    }}
                                    onclick={beginGoal}
                                    style:--accent-color="#a70"
                                    disabled={!currentGoal.value}
                                    >Goal
                                </button>
                                <button
                                    type="button"
                                    class={{
                                        "toggle-button": true,
                                        error: commandErrorCount.value > 0,
                                        active: !running.value && !goal.value,
                                    }}
                                    onclick={beginEdit}
                                    style:--accent-color="#08a"
                                    disabled={!running.value && !goal.value}
                                    >Edit
                                </button>
                                <button
                                    type="button"
                                    class={{
                                        "toggle-button": true,
                                        error: commandErrorCount.value > 0,
                                        active: running.value && !goal.value,
                                    }}
                                    onclick={beginExecute}
                                    style:--accent-color="#084"
                                    disabled={commandErrorCount.value > 0}
                                    >Run</button
                                >
                            </div>
                            {#if commandErrorCount.value > 0}
                                <div class="error-summary">
                                    {commandErrorCount.value}
                                    {commandErrorCount.value > 1
                                        ? "Errors"
                                        : "Error"}
                                </div>
                            {/if}
                            {#if running.value}
                                <Stepper
                                    {goal}
                                    {executeLine}
                                    {startExecution}
                                    {resetExecution}
                                    {pauseExecution}
                                    {executionError}
                                    {autoplaySpeed}
                                    {halted}
                                    {autoplay}
                                    {commandErrorCount}
                                ></Stepper>
                            {/if}
                        </div>

                        <Editor
                            running={editorRunning}
                            commands={currentCommands}
                            currentLine={editorCurrentLine}
                            halted={editorHalted}
                            {allJumpTargets}
                            {executionError}
                        ></Editor>
                        <details bind:open={showGoalText.value}>
                            <summary>Goal </summary>
                            <div>
                                Help Caroline to achieve her goal. Play the goal
                                recording to see what to do. Then switch to the
                                edit mode, write down the commands to reproduce
                                the same movement.
                            </div>
                        </details>

                        <details bind:open={showHelp.value}>
                            <summary>Help</summary>
                            <div>
                                <Help></Help>
                            </div>
                        </details>
                    </div>
                {:else}
                    <div style="display: flex; flex-direction: column;">
                        <div class="world-stack">
                            <div class="canvas-container">
                                <World {player} {level}></World>
                            </div>

                            <Stack {stack} disabled={hideStack}></Stack>
                            <footer>
                                <p>
                                    <a
                                        href="https://github.com/fredoverflow/karel"
                                        target="_blank">Inspired by karel</a
                                    >
                                </p>
                                <hr />

                                <p>
                                    <a
                                        href="//tools.laszlokorte.de"
                                        target="_blank"
                                        >More Educational Tools</a
                                    >
                                </p>
                            </footer>
                        </div>
                    </div>
                {/if}
            {/snippet}
        </Split>
    </div>
</div>

<style>
    .controls {
        display: flex;
        align-items: stretch;
        font-family: monospace;
        gap: 3em;
        padding: 1ex 1em;
        justify-content: space-between;
        background-image: linear-gradient(#fff, #eee, #ccc);
        border-bottom: 2px solid #bbb;
    }
    .controls label:has(select, input) {
        display: flex;
        align-items: center;
        gap: 1ex;
    }
    select {
        align-self: stretch;
        min-width: 20em;
        padding: 0 1em 0 1ex;
        border-radius: 5px;
        background: #fff;
        border: 2px solid #ccc;
        font: inherit;
    }
    .toolbar {
        display: flex;
        flex-wrap: wrap;
        gap: 1ex;
        padding: 0.5ex;
        background-color: #333;
        color: #eee;
        border-bottom: 2px solid #444;
        font-family: monospace;
        overflow: hidden;
        justify-content: space-between;
    }
    button {
        font: inherit;
        padding: 0.8ex;
        margin: 0;
        border: 1px solid #fff5;
    }
    abbr {
        cursor: help;
    }

    .button-row {
        display: flex;
        gap: 5px;
        padding: 2px;
    }
    .toggle-buttons {
        display: flex;
        gap: 0;
        border: 1px solid #fff5;
        border-radius: 7px;
    }
    .toggle-button {
        border: none;
        background-color: transparent;
        padding: 1.5ex 2ex;
        border: 1px solid #0000;
        color: #fff;
        margin: 1px;
        border-radius: 5px;
    }
    .toggle-button.active {
        color: #fff;
        font-weight: normal;
        background-color: var(--accent-color);
        border: 1px solid #0a6;
        color: #cfe;
        font-weight: bold;
        border-color: #fff5;
    }
    .toggle-button:disabled:not(.active).error {
        text-decoration: line-through;
    }
    .toggle-button:not(:disabled):not(.active).error {
        background: #a005;
        color: #fee;
    }
    .toggle-button.error:not(.active) {
        background: #a001;
        color: #a66;
    }

    .robot-container {
        display: block;
        width: 100%;
        overflow: auto;
        box-sizing: border-box;
    }
    .world-stack {
        display: grid;
        grid-template-rows: auto auto 1fr;
        grid-auto-rows: auto;
        flex-direction: column;
        align-content: start;
        align-items: stretch;
        justify-content: stretch;
        flex-grow: 1;
        width: 100%;
    }
    .canvas-container {
        position: relative;
        display: grid;
        align-content: stretch;
        align-items: stretch;
    }

    .error-summary {
        align-self: stretch;
        display: flex;
        align-items: center;
        color: #ffbbbb;
        font-weight: bold;
        margin-right: auto;
    }
    .container {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        display: grid;
        grid-template-rows: auto 1fr;
    }
    .editor {
        display: grid;
        grid-template-rows: auto 1fr;
        background-color: #333;
        max-height: 100%;
        align-self: stretch;
        overflow-y: auto;
    }
    .level-button {
        border-radius: 8px;
        padding: 1ex 1em;
    }
    h1 {
        margin: 0;
        font-size: 1em;
        align-self: center;
        padding: 0;
        display: flex;
        align-items: center;
        gap: 1ex;
    }
    h1 img {
        height: 1.5em;
        width: 1.5em;
    }
    summary {
        padding: 1em;
        background-color: #000;
        color: #fff;
        font-family: monospace;
        cursor: pointer;
    }
    details {
        margin-top: 2px;
    }
    details > div {
        padding: 1em;
        background-color: #fff;
        color: #000;
        font-family: monospace;
        max-height: 50vh;
        overflow: auto;
    }
    footer {
        margin-top: auto;
        align-self: end;

        font-family: monospace;
        padding: 1ex;
        text-align: center;
        margin: 0;
    }
    hr {
        border: none;
        height: 1px;
        background-color: #eee;
    }
</style>
